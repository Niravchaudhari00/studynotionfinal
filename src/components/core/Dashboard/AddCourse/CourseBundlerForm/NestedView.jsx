import { useState } from "react";
import { AiFillCaretDown, AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { RxDropdownMenu } from "react-icons/rx";
import { MdEdit } from "react-icons/md";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import { BsPlusSquareFill } from "react-icons/bs";
import {
     deleteSection,
     deleteSubSection,
} from "../../../../../service/operations/CourseApi";
import { setCourse } from "../../../../../slices/courseSlice";
import SubSectionModal from "./SubSectionModal";
const NestedView = ({ handleEditSection }) => {
     const { course } = useSelector((state) => state.course);
     const { token } = useSelector((state) => state.auth);
     const dispatch = useDispatch();

     // flag of section modal
     const [addSectionModal, setAddSectionModal] = useState(null);
     const [viewSectionModal, setViewSectionModal] = useState(null);
     const [editSectionModal, setEditSectionModal] = useState(null);
     const [loading, setLoading] = useState(false);
     const [confirmationModal, setConfirmationModal] = useState(null);

     // hadle delete section
     const handleDeleteSection = async (sectionId) => {
          setLoading(true);
          const result = await deleteSection(token, {
               courseId: course._id,
               sectionId: sectionId,
          });

          if (result) {
               dispatch(setCourse(result));
          }
          setConfirmationModal(null);
          setLoading(false);
     };

     // handle delete sub section
     const handleDeleteSubSection = async (subSectionId, sectionId) => {
          console.log(`Handle sub section click`);
          setLoading(true);
          const result = await deleteSubSection(token, {
               subSectionId,
               sectionId,
          });
          if (result) {
               const courseUpdateContent = course.courseContent.map((section) => (
                    section._id === sectionId ? result : section
               ))
               const updateCourse = { ...course, courseContent: courseUpdateContent }
               dispatch(setCourse(updateCourse));
          }
          setConfirmationModal(null);
          setLoading(false);
     };
     return (
          <>
               <div className="rounded-lg bg-richblack-700 p-6 px-8">
                    {course?.courseContent?.map((section) => (
                         <details key={section._id}>
                              <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
                                   <div className="flex items-center gap-x-4">
                                        <RxDropdownMenu className="text-2xl text-richblack-50" />
                                        <p className="font-semibold text-richblack-50">
                                             {section?.sectionName}
                                        </p>
                                   </div>
                                   <div className="flex items-center gap-x-4">
                                        {/* Delete section */}
                                        <button
                                             type="button"
                                             className=""
                                             onClick={() => {
                                                  handleEditSection(
                                                       section?._id,
                                                       section?.sectionName
                                                  );
                                             }}
                                        >
                                             <MdEdit className="text-xl text-richblack-300" />
                                        </button>
                                        {/* confirmation modal for section */}
                                        <button
                                             type="button"
                                             onClick={() =>
                                                  setConfirmationModal({
                                                       title: `Are your sure.`,
                                                       subTitle: `You want to delete section`,
                                                       confirmBtnTxt: `Delete`,
                                                       cancelBtnTxt: `No`,
                                                       btnConfirmHandler: () =>
                                                            handleDeleteSection(
                                                                 section._id
                                                            ),
                                                       btnCancelHandler: () =>
                                                            setConfirmationModal(
                                                                 null
                                                            ),
                                                  })
                                             }
                                        >
                                             <AiFillDelete className="text-xl text-richblack-300" />
                                        </button>
                                        <span className="font-medium text-richblack-300">
                                             |
                                        </span>
                                        <AiFillCaretDown
                                             className={`text-xl text-richblack-300`}
                                        />
                                   </div>
                              </summary>
                              <div className="px-6 pb-4">
                                   {section?.subSection?.map((data) => (
                                        <div
                                             className="flex justify-between cursor-pointer gap-x-3 border-b-2 border-b-richblack-600 py-2"
                                             onClick={() =>
                                                  setViewSectionModal(data)
                                             }
                                             key={data._id}
                                        >
                                             <div className="flex gap-x-3">
                                                  <RxDropdownMenu className="text-2xl text-richblack-50" />
                                                  <p className="font-semibold text-richblack-50">
                                                       {data?.title}
                                                  </p>

                                             </div>
                                             <div
                                                  className="flex items-center gap-x-2"
                                                  onClick={(e) =>
                                                       e.stopPropagation()
                                                  }
                                             >

                                                  {/* Handle Delete Sub Section */}
                                                  <button
                                                       className=""
                                                       type="button"
                                                       onClick={() => {
                                                            setEditSectionModal(
                                                                 {
                                                                      ...data,
                                                                      sectionId: section._id,
                                                                 }
                                                            );
                                                       }}
                                                  >
                                                       <MdEdit className="text-xl text-richblack-300" />
                                                  </button>
                                                  {/* Confirmation Modal for Sub Section */}
                                                  <button
                                                       disabled={
                                                            loading
                                                       }
                                                       type="button"
                                                       onClick={() =>
                                                            setConfirmationModal(
                                                                 {
                                                                      title: `Delete this Sub-Section?`,
                                                                      subTitle: `This lecture will be deleted`,
                                                                      confirmBtnTxt: `Delete`,
                                                                      cancelBtnTxt: `No`,
                                                                      btnConfirmHandler:
                                                                           () =>
                                                                                handleDeleteSubSection(
                                                                                     data._id,
                                                                                     section._id
                                                                                ),
                                                                      btnCancelHandler:
                                                                           () =>
                                                                                setConfirmationModal(
                                                                                     null
                                                                                ),
                                                                 }
                                                            )
                                                       }
                                                  >
                                                       <AiFillDelete className="text-xl text-richblack-300" />
                                                  </button>

                                             </div>
                                        </div>
                                   ))}
                                   {/* ADD SUBSECTION */}
                                   <button
                                        onClick={() =>
                                             setAddSectionModal(section._id)
                                        }
                                        className="flex justify-center items-center gap-x-2 mt-3"
                                   >
                                        <BsPlusSquareFill className="text-yellow-50" />
                                        <span className="text-yellow-50">
                                             Add Lecture
                                        </span>
                                   </button>
                              </div>
                         </details>
                    ))}
               </div >
               {/* display modal */}
               {
                    addSectionModal ? (
                         <SubSectionModal
                              setModalData={setAddSectionModal}
                              modalData={addSectionModal}
                              add={true}
                         />
                    ) : viewSectionModal ? (
                         <SubSectionModal
                              setModalData={setViewSectionModal}
                              modalData={viewSectionModal}
                              view={true}
                         />
                    ) : editSectionModal ? (
                         <SubSectionModal
                              setModalData={setEditSectionModal}
                              modalData={editSectionModal}
                              edit={true}
                         />
                    ) : (
                         <></>
                    )
               }
               {/* confirmation modal */}
               {
                    confirmationModal && (
                         <ConfirmationModal modalData={confirmationModal} />
                    )
               }
          </>
     );
};

export default NestedView;
