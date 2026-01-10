"use client";

import FavoriteLayoutFull from "@/components/Organism/layouts/FavoriteLayoutFull";
import { FavoriteProvider, useFavorite } from "@/provider/favoriteProvider";

const PageContent = () => {
  const {
    dataFilms,
    getTotalFavoriteData,
    isLoading,
    handleFilter,
    filterType,
    page,
    handlePageChange,
  } = useFavorite();

  return (
    <FavoriteLayoutFull
      dataTotalFilm={getTotalFavoriteData}
      dataFilms={dataFilms}
      isLoading={isLoading}
      handleFilter={handleFilter}
      filterType={filterType}
      currentPage={page}
      onPageChange={handlePageChange}
    />
  );
};

const FavoritePage = () => {
  return (
    <FavoriteProvider>
      <PageContent />
    </FavoriteProvider>
  );
};

export default FavoritePage;
