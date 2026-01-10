"use client";
import { UseGetSearchMovie } from "@/hookAPI/TMDB/search/UseGetSearchMovie";
import { UseGetSearchSeries } from "@/hookAPI/TMDB/search/UseGetSearchSeries";
import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const SearchContext = createContext(null);

export const SearchProvider = ({ children, searchQuery }) => {
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);

  // Reset state ketika searchQuery berubah
  useEffect(() => {
    setFilterType("all");
    setPage(1);
  }, [searchQuery]);

  const { data: searchMovieData, isLoading: isSearchMovieLoading } =
    UseGetSearchMovie(
      searchQuery,
      page,
      filterType === "movie" || filterType === "all"
    );

  const { data: searchSeriesData, isLoading: isSearchSeriesLoading } =
    UseGetSearchSeries(
      searchQuery,
      page,
      filterType === "series" || filterType === "all"
    );

  const isLoading = isSearchMovieLoading || isSearchSeriesLoading;

  const searchData = useMemo(() => {
    if (filterType === "movie") {
      return {
        results: searchMovieData?.results || [],
        total_pages: searchMovieData?.total_pages || 1,
        total_results: searchMovieData?.total_results || 0,
      };
    }

    if (filterType === "series") {
      return {
        results: searchSeriesData?.results || [],
        total_pages: searchSeriesData?.total_pages || 1,
        total_results: searchSeriesData?.total_results || 0,
      };
    }

    // filterType === "all" - gabungkan movie dan series
    const movieResults = searchMovieData?.results || [];
    const seriesResults = searchSeriesData?.results || [];

    // Gabungkan dan tandai tipe masing-masing
    const combinedResults = [
      ...movieResults.map((item) => ({ ...item, media_type: "movie" })),
      ...seriesResults.map((item) => ({ ...item, media_type: "tv" })),
    ];

    // Sort by popularity descending
    combinedResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

    const totalMovieResults = searchMovieData?.total_results || 0;
    const totalSeriesResults = searchSeriesData?.total_results || 0;
    const totalCombined = totalMovieResults + totalSeriesResults;

    // Untuk pagination di mode "all", gunakan yang lebih besar
    const maxPages = Math.max(
      searchMovieData?.total_pages || 1,
      searchSeriesData?.total_pages || 1
    );

    return {
      results: combinedResults,
      total_pages: maxPages,
      total_results: totalCombined,
    };
  }, [filterType, searchMovieData, searchSeriesData]);

  const handleFilter = useCallback((type) => {
    setFilterType(type);
    setPage(1); // reset pagination
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // TMDB API has a maximum limit of 500 pages
  const totalPages = useMemo(
    () => Math.min(searchData.total_pages, 500),
    [searchData.total_pages]
  );

  const contextValue = useMemo(
    () => ({
      filterType,
      page,
      searchData,
      isLoading,
      totalPages,
      handleFilter,
      handlePageChange,
    }),
    [
      filterType,
      page,
      searchData,
      isLoading,
      totalPages,
      handleFilter,
      handlePageChange,
    ]
  );

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used inside SearchProvider");
  }
  return context;
};
