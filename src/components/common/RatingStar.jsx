import React, { useEffect, useState } from "react";
import {
     TiStarFullOutline,
     TiStarHalfOutline,
     TiStarOutline,
} from "react-icons/ti";
const RatingStar = ({ ReviewCount, StarSize }) => {
     const [starCount, setStarCount] = useState({
          full: 0,
          half: 0,
          empty: 0,
     });

     useEffect(() => {
          const wholeStar = Math.floor(ReviewCount) || 0;
          setStarCount({
               full: wholeStar,
               half: Number.isInteger(ReviewCount) ? 0 : 1,
               empty: Number.isInteger(ReviewCount)
                    ? 5 - wholeStar
                    : 4 - wholeStar,
          });
     }, [ReviewCount]);
     return <div className="flex gap-x-1 text-yellow-100">
          {
               [...new Array(starCount.full)].map((_, i) => {
                    return <TiStarFullOutline key={i} size={StarSize || 20} />
               })
          }
          {
               [...new Array(starCount.half)].map((_, i) => {
                    return <TiStarHalfOutline key={i} size={StarSize || 20} />
               })
          }
          {
               [...new Array(starCount.empty)].map((_, i) => {
                    return <TiStarOutline key={i} size={StarSize || 20} />
               })
          }
     </div>;
};

export default RatingStar;
