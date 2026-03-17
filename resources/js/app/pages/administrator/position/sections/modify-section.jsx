// import React, { useState } from "react";
// import { Pencil } from "lucide-react";
// import { useForm } from "react-hook-form";
// import Modal from "@/app/_components/modal";

// // ─── EditPositionModal ────────────────────────────────────────────────────────
// const EditPositionModal = ({ isOpen, onClose, position, onSave }) => {
//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors, isSubmitting },
//     } = useForm({
//         defaultValues: {
//             position: position?.title ?? "",
//             limit: position?.limit ?? 1,
//             description: position?.description ?? "",
//         },
//     });

//     const submitForm = async (data) => {
//         // Replace this with your real API call
//         await new Promise((res) => setTimeout(res, 800));
//         onSave?.({ ...position, ...data });
//         reset();
//         onClose();
//     };

//     const handleClose = () => {
//         reset();
//         onClose();
//     };

//     return (
//         <Modal isOpen={isOpen} onClose={handleClose} title="Edit Position" width="max-w-2xl">
//             <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
//                 {/* Position */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                         Position <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                         {...register("position", {
//                             required: "Position is required",
//                         })}
//                         type="text"
//                         className={`w-full px-3 py-2 border ${
//                             errors.position ? "border-red-500" : "border-gray-300"
//                         } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                         placeholder="Enter position title"
//                     />
//                     {errors.position && (
//                         <p className="text-sm text-red-500 mt-1">
//                             {errors.position.message}
//                         </p>
//                     )}
//                 </div>

//                 {/* Limit */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                         Limit <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                         {...register("limit", {
//                             required: "Limit is required",
//                             min: { value: 1, message: "Minimum value is 1" },
//                             valueAsNumber: true,
//                         })}
//                         type="number"
//                         min="1"
//                         className={`w-full px-3 py-2 border ${
//                             errors.limit ? "border-red-500" : "border-gray-300"
//                         } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                         placeholder="Enter position limit"
//                     />
//                     {errors.limit && (
//                         <p className="text-sm text-red-500 mt-1">
//                             {errors.limit.message}
//                         </p>
//                     )}
//                 </div>

//                 {/* Description */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                         Description
//                     </label>
//                     <textarea
//                         {...register("description")}
//                         rows={3}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                         placeholder="Enter position description (optional)"
//                     />
//                 </div>

//                 {/* Footer */}
//                 <div className="flex justify-end gap-2 pt-4 border-t">
//                     <button
//                         type="button"
//                         onClick={handleClose}
//                         className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         disabled={isSubmitting}
//                         className="px-4 py-2 rounded-lg border border-green-500 text-green-600 hover:bg-green-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//                     >
//                         {isSubmitting ? "Saving..." : "Save Changes"}
//                     </button>
//                 </div>
//             </form>
//         </Modal>
//     );
// };

// // ─── ActionSection ────────────────────────────────────────────────────────────
// /**
//  * Props:
//  *  pos    – position object { id, title, limit, description }
//  *  onSave – callback(updatedPos) called after a successful save
//  */
// export default function ActionSection({ pos = {}, onSave }) {
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     return (
//         <div className="flex space-x-2">
//             {/* Edit Button */}
//             <button
//                 type="button"
//                 onClick={() => setIsModalOpen(true)}
//                 className="inline-flex items-center gap-1 text-blue-600 border border-blue-300 hover:bg-blue-50 px-3 py-1.5 text-sm rounded-lg transition-colors duration-200"
//             >
//                 <Pencil size={14} />
//             </button>

//             {/* Edit Modal */}
//             <EditPositionModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//                 position={pos}
//                 onSave={(updated) => {
//                     onSave?.(updated);
//                     setIsModalOpen(false);
//                 }}
//             />
//         </div>
//     );
// }