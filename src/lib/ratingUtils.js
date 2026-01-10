/**
 * Calculate average rating from film reviews
 * @param {Array} reviews - Array of review objects with rating property
 * @returns {number} Average rating (0-100) or 0 if no reviews
 */
export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return 0;
  }

  const totalRating = reviews.reduce(
    (sum, review) => sum + (review.rating || 0),
    0
  );
  const averageRating = totalRating / reviews.length;

  // Round to nearest integer for display
  return Math.round(averageRating);
};
