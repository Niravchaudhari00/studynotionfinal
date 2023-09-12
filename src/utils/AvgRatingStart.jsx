const AvgRatingStart = (ratingArr) => {
     if (ratingArr?.length === 0) return 0;

     const totalReviewRating = ratingArr?.reduce((acc, curr) => {
          acc += curr.rating;
          return acc;
     }, 0);

     const multipler = Math.pow(10, 1);
     const avaRatingCount =
          Math.round((totalReviewRating / ratingArr?.length) * multipler) /
          multipler;

     return avaRatingCount;
};

export default AvgRatingStart;
