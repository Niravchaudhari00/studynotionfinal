import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { categories } from "../service/apis";
import { apiConnector } from "../service/apiConnector";
import Spinner from "../../src/components/common/Spinner";
import { CatalogEndpoint } from "../service/apis";
import CourseSlide from "../components/core/Catalog/CourseSlide";
import CourseCart from "../components/core/Catalog/CourseCart";
import Footer from "../components/common/Footer";

const { CATAGORIES_API } = categories;
const Catalog = () => {
     const { catalogName } = useParams();
     const [categoryId, setCategoryId] = useState("");
     const [loading, setLoading] = useState(false);
     const [active, setActive] = useState(1);
     const [catalogData, setCatalogData] = useState(null);

     // category name
     useEffect(() => {
          (async () => {
               try {
                    const response = await apiConnector(
                         "GET",
                         categories.CATAGORIES_API
                    );
                    const category_id = response.data.data.filter(
                         (ct) =>
                              ct.name.split(" ").join("-").toLowerCase() ===
                              catalogName
                    )[0]._id;
                    setCategoryId(category_id);
               } catch (error) {
                    console.log(error.message);
                    console.log(`something went wrong`);
               }
          })();
     }, [catalogName]);

     // Get catalog page details
     useEffect(() => {
          const catalogPageDetails = async () => {
               let result = [];
               setLoading(true);
               try {
                    const response = await apiConnector(
                         "POST",
                         CatalogEndpoint.GET_CATEGORY_PAGE_AND_COMPONENT_DATA_API,
                         { categoryId: categoryId }
                    );
                    // console.log(`CATEGORY PAGE DETAILS`, response);
                    !response.data.success ??
                         console.log(response.data.message);
                    result = response?.data;
               } catch (error) {
                    // console.log(`CATEGORY FETCH ERROR `, error);
                    result = error?.response?.data;
               }
               setLoading(false);
               setCatalogData(result);
          };

          if (categoryId) {
               catalogPageDetails();
          }
     }, [categoryId]);

     if (loading || !catalogData) {
          return <Spinner />;
     }

     if (!loading && !catalogData.success) {
          return <Navigate to={"/*"} />;
     }

     return (
          <>
               <div className="box-content bg-richblack-800">
                    <div className="min-h-[260px] max-w-maxContentTab lg:max-w-maxContent mx-auto w-11/12 justify-center flex flex-col gap-4">
                         <p className="text-richblack-300 self-baseline capitalize">
                              {`home / catalog / `}
                              <span className="text-yellow-25">
                                   {catalogData?.data?.selectedCategory?.name.toLowerCase()}
                              </span>
                         </p>
                         <h2 className="text-3xl font-semibold text-richblack-5">
                              {catalogData?.data?.selectedCategory?.name}
                         </h2>
                         <p className="max-w-[870px] text-richblack-200">
                              {catalogData?.data?.selectedCategory?.description}
                         </p>
                    </div>
               </div>
               {/* Section - 1 */}
               <section className="mx-auto max-w-maxContentTab lg:max-w-maxContent w-11/12">
                    <div className="my-10">
                         <h2 className="section_heading my-2 capitalize">
                              Courses to get you started
                         </h2>
                         <div className="flex items-center border-b border-b-richblack-600 text-sm my-4 flex-row gap-x-1 ">
                              <p
                                   className={`${active === 1
                                        ? "text-yellow-50 border-b border-b-yellow-50"
                                        : "text-richblack-5"
                                        } px-4 py-2 cursor-pointer`}
                                   onClick={() => setActive(1)}
                              >
                                   Most Popular
                              </p>
                              <p
                                   className={`${active === 2
                                        ? "text-yellow-50 border-b border-b-yellow-50"
                                        : "text-richblack-5"
                                        } px-4 py-2 cursor-pointer`}
                                   onClick={() => setActive(2)}
                              >
                                   New
                              </p>
                         </div>
                         {/* course cord */}
                         <CourseSlide
                              courses={
                                   catalogData?.data?.selectedCategory?.courses
                              }
                         />
                    </div>
               </section>
               {/* Section - 2  */}
               <section className="mx-auto max-w-maxContentTab lg:max-w-maxContent w-11/12 my-10">
                    <h2 className="section_heading my-2 capitalize">
                         Top Course in{" "}
                         {catalogData?.data?.selectedCategory?.name}
                    </h2>
                    <div>
                         <CourseSlide
                              courses={
                                   catalogData?.data?.selectedCategory?.courses
                              }
                         />
                    </div>
               </section>
               {/* section - 3 */}
               <section className="mx-auto max-w-maxContentTab lg:max-w-maxContent w-11/12 my-10">
                    <h2 className="section_heading my-2 capitalize">
                         Frequently Bought
                    </h2>
                    <div className="my-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
                         {catalogData?.data?.selectedCategory?.courses
                              ?.slice(0, 4)
                              .map((course, i) => (
                                   <CourseCart key={i} course={course} height={`h-[350px]`} />
                              ))}
                    </div>
               </section>

               <Footer />
          </>
     );
};

export default Catalog;
