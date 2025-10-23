// import React, { useState } from 'react'
// import { Home, DollarSign, Hash, Users, Zap, Droplets, Wifi, Trash, FileText, Building } from "lucide-react";
// import Select from '@/app/_components/select';
// export default function SelectFamilyHouseholdSection() {
//     function Select({ children, name, value, onChange, className = "", ...props }) {
//         return (
//             <select
//                 name={name}
//                 value={value}
//                 onChange={onChange}
//                 className={className}
//                 {...props}
//             >
//                 {children}
//             </select>
//         );
//     }
//     const [formData, setFormData] = useState({
//         familyId: '',
//         incomeType: 'bracket', // 'bracket' or 'numeric'
//         incomeBracket: '',
//         numericIncome: '',
//         houseType: '',
//         numberOfRooms: '',
//         utilities: {
//             electricity: false,
//             water: false,
//             internet: false,
//             cable: false,
//             landline: false
//         },
//         toiletType: '',
//         wasteDisposal: '',
//         notes: ''
//     });

//     const [errors, setErrors] = useState({});

//     // Sample data
//     const [existingFamilies] = useState([
//         {
//             id: 'FAM-202501',
//             headOfFamily: 'Juan Dela Cruz',
//             address: 'Sitio Maligaya, Main St.',
//             memberCount: 4
//         },
//         {
//             id: 'FAM-202502',
//             headOfFamily: 'Maria Santos',
//             address: 'Sitio Bagong Pag-asa, Church St.',
//             memberCount: 3
//         },
//         {
//             id: 'FAM-202503',
//             headOfFamily: 'Pedro Rodriguez',
//             address: 'Sitio Tahanan, Market St.',
//             memberCount: 5
//         }
//     ]);

//     const incomeBrackets = [
//         "Below ₱10,000",
//         "₱10,000 - ₱20,000",
//         "₱20,001 - ₱30,000",
//         "₱30,001 - ₱50,000",
//         "₱50,001 - ₱75,000",
//         "₱75,001 - ₱100,000",
//         "Above ₱100,000"
//     ];

//     const houseTypes = [
//         "Concrete",
//         "Semi-concrete",
//         "Wood",
//         "Bamboo",
//         "Mixed (Concrete & Wood)",
//         "Nipa/Cogon",
//         "Makeshift/Temporary",
//         "Apartment/Condominium"
//     ];

//     const toiletTypes = [
//         "Water-sealed toilet",
//         "Closed pit latrine",
//         "Open pit latrine",
//         "Pour flush toilet",
//         "Composting toilet",
//         "Shared toilet facility",
//         "No toilet facility"
//     ];

//     const wasteDisposalTypes = [
//         "Collected by garbage truck",
//         "Burning",
//         "Burying",
//         "Composting",
//         "Throwing in vacant lot/waterway",
//         "Feeding to animals",
//         "Others"
//     ];

//     const handleInputChange = (e) => {
//         const { name, value, type, checked } = e.target;

//         if (name.startsWith('utilities.')) {
//             const utilityName = name.split('.')[1];
//             setFormData(prev => ({
//                 ...prev,
//                 utilities: {
//                     ...prev.utilities,
//                     [utilityName]: checked
//                 }
//             }));
//         } else {
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: type === 'checkbox' ? checked : value
//             }));
//         }

//         // Clear related errors
//         setErrors(prev => ({ ...prev, [name]: '' }));
//     };

//     const handleIncomeTypeChange = (type) => {
//         setFormData(prev => ({
//             ...prev,
//             incomeType: type,
//             incomeBracket: '',
//             numericIncome: ''
//         }));
//     };

//     const validateForm = () => {
//         const newErrors = {};

//         if (!formData.familyId) {
//             newErrors.familyId = 'Please select a family';
//         }

//         if (formData.incomeType === 'bracket' && !formData.incomeBracket) {
//             newErrors.income = 'Please select an income bracket';
//         }

//         if (formData.incomeType === 'numeric' && !formData.numericIncome) {
//             newErrors.income = 'Please enter monthly income';
//         }

//         if (!formData.houseType) {
//             newErrors.houseType = 'Please select house type';
//         }

//         if (!formData.numberOfRooms || parseInt(formData.numberOfRooms) < 0) {
//             newErrors.numberOfRooms = 'Please enter a valid number of rooms';
//         }

//         if (!formData.toiletType) {
//             newErrors.toiletType = 'Please select toilet type';
//         }

//         if (!formData.wasteDisposal) {
//             newErrors.wasteDisposal = 'Please select waste disposal method';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const resetForm = () => {
//         setFormData({
//             familyId: '',
//             incomeType: 'bracket',
//             incomeBracket: '',
//             numericIncome: '',
//             houseType: '',
//             numberOfRooms: '',
//             utilities: {
//                 electricity: false,
//                 water: false,
//                 internet: false,
//                 cable: false,
//                 landline: false
//             },
//             toiletType: '',
//             wasteDisposal: '',
//             notes: ''
//         });
//         setErrors({});
//     };

//     const handleSubmit = () => {
//         if (!validateForm()) {
//             return;
//         }

//         const submitData = {
//             ...formData,
//             income: formData.incomeType === 'bracket' ? formData.incomeBracket : formData.numericIncome,
//             utilityList: Object.entries(formData.utilities)
//                 .filter(([_, enabled]) => enabled)
//                 .map(([utility, _]) => utility)
//         };

//         console.log('Household Details Submitted:', submitData);
//         alert('Household details saved successfully!');

//         // Reset form
//         resetForm();
//     };

//     const selectedFamily = existingFamilies.find(family => family.id === formData.familyId);

//     return (
//         <div>
//             <label className="block text-sm font-medium text-gray-700 mb-3">
//                 <Hash className="inline w-4 h-4 mr-1" />
//                 Select Family ID *
//             </label>

//             <div className="w-full">
//                 <div className="relative">
//                     <Users className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 z-10" />
//                     <Select
//                         name="familyId"
//                         value={formData.familyId}
//                         onChange={handleInputChange}
//                         className="w-full pl-10 pr-4 py-2.5 border bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
//                     >
//                         <option value="">Select a family</option>
//                         {existingFamilies.map(family => (
//                             <option key={family.id} value={family.id}>
//                                 {family.id} - {family.headOfFamily} ({family.memberCount} members)
//                             </option>
//                         ))}
//                     </Select>
//                 </div>
//                 {errors.familyId && <p className="text-sm text-red-500 mt-1 ml-1">{errors.familyId}</p>}
//             </div>

//             {selectedFamily && (
//                 <div className="mt-3 p-3 bg-blue-50 rounded-md">
//                     <p className="text-sm text-blue-800">
//                         <strong>Selected Family:</strong> {selectedFamily.headOfFamily} - {selectedFamily.address}
//                         <br />
//                         <strong>Members:</strong> {selectedFamily.memberCount}
//                     </p>
//                 </div>
//             )}
//         </div>
//     )
// }
