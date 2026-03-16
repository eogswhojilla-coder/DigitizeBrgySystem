// import Button from "@/app/_components/button";
// import Modal from "@/app/_components/modal";
// import { update_user_account_service } from "@/app/services/user-account-service";
// import store from "@/app/store/store";
// import React, { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { X } from "lucide-react";
// import Swal from "sweetalert2";
// import { get_user_account_thunk } from "@/app/redux/user-account-thunk";

// export default function ModifySection({ item, open, onClose }) {
//     const {
//         register,
//         handleSubmit,
//         formState: { errors, isSubmitting },
//         reset,
//         setValue,
//     } = useForm({
//         defaultValues: {
//             position: "",
//             limit: "",
//             description: "",
//         },
//     });

//     useEffect(() => {
//         if (item) {
//             setValue("position", item.position || "");
//             setValue("limit", item.limit || "");
//             setValue("description", item.description || "");
//         }
//     }, [item, setValue]);

//     const submitForm = async (data) => {
//         try {
//             await update_user_account_service({ ...data, id: item.id });
//             await store.dispatch(get_user_account_thunk());

//             await Swal.fire({
//                 icon: "success",
//                 title: "Account updated successfully!",
//                 showConfirmButton: false,
//                 timer: 1500,
//             });

//             reset();
//             onClose();
//         } catch (error) {
//             console.error("Error updating account:", error);

//             Swal.fire({
//                 icon: "error",
//                 title: "Something went wrong",
//             });
//         }
//     };

//     return (
//         <Modal
//             width="max-w-2xl"
//             isOpen={open}
//             onClose={onClose}
//             title="Edit User Account"
//         >
//             <form onSubmit={handleSubmit(submitForm)} className="space-y-6">

//                 {/* Modal Header */}
//                 <div className="flex items-center justify-between p-6 border-b">
//                     <h2 className="text-xl font-semibold text-gray-800">
//                         Edit Position
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={onClose}
//                         className="text-gray-400 hover:text-gray-600 transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 {/* Modal Body */}
//                 <div className="p-6 space-y-4">

//                     {/* Position */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Position <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                             {...register("position", { required: "Position is required" })}
//                             type="text"
//                             className={`w-full px-3 py-2 border ${
//                                 errors.position ? "border-red-500" : "border-gray-300"
//                             } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                             placeholder="Enter position title"
//                         />
//                         {errors.position && (
//                             <p className="text-sm text-red-500 mt-1">
//                                 {errors.position.message}
//                             </p>
//                         )}
//                     </div>

//                     {/* Limit */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Limit <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                             {...register("limit", {
//                                 required: "Limit is required",
//                                 min: { value: 1, message: "Minimum value is 1" },
//                             })}
//                             type="number"
//                             min="1"
//                             className={`w-full px-3 py-2 border ${
//                                 errors.limit ? "border-red-500" : "border-gray-300"
//                             } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                             placeholder="Enter position limit"
//                         />
//                         {errors.limit && (
//                             <p className="text-sm text-red-500 mt-1">
//                                 {errors.limit.message}
//                             </p>
//                         )}
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Description
//                         </label>
//                         <textarea
//                             {...register("description")}
//                             rows="3"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                             placeholder="Enter position description (optional)"
//                         />
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="flex justify-end gap-2 pt-4 border-t px-6 pb-6">
//                     <Button
//                         type="button"
//                         outlined
//                         onClick={() => {
//                             reset();
//                             onClose();
//                         }}
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         variant="success"
//                         outlined
//                         disabled={isSubmitting}
//                         type="submit"
//                     >
//                         {isSubmitting ? "Saving..." : "Save Changes"}
//                     </Button>
//                 </div>
//             </form>
//         </Modal>
//     );
// }