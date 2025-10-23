// import Button from '@/app/_components/button';
// import React, { useState } from 'react'
// import { Plus, Users, Search, Trash2, UserPlus, Hash, Heart, Briefcase } from "lucide-react";
// export default function SaveButtonSection() {
//    const [selectedFamilyId, setSelectedFamilyId] = useState('');
//         const [familyMembers, setFamilyMembers] = useState([
//           {
//             id: 1,
//             residentId: '',
//             isExistingResident: true,
//             newResidentName: '',
//             relationship: '',
//             role: '',
//             searchTerm: ''
//           }
//         ]);
//         const [errors, setErrors] = useState({});
//         const [searchResults, setSearchResults] = useState({});
      
//         // Sample data
//         const [existingFamilies] = useState([
//           { id: 'FAM-202501', headOfFamily: 'Juan Dela Cruz', address: 'Sitio Maligaya, Main St.' },
//           { id: 'FAM-202502', headOfFamily: 'Maria Santos', address: 'Sitio Bagong Pag-asa, Church St.' },
//           { id: 'FAM-202503', headOfFamily: 'Pedro Rodriguez', address: 'Sitio Tahanan, Market St.' }
//         ]);
      
//         const [availableResidents] = useState([
//           { id: 1, name: "Ana Garcia", age: 29, gender: "Female" },
//           { id: 2, name: "Carlos Mendoza", age: 41, gender: "Male" },
//           { id: 3, name: "Sofia Reyes", age: 16, gender: "Female" },
//           { id: 4, name: "Miguel Torres", age: 8, gender: "Male" },
//           { id: 5, name: "Elena Morales", age: 65, gender: "Female" },
//           { id: 6, name: "Ricardo Santos", age: 32, gender: "Male" }
//         ]);
      
//         const relationships = [
//           "Spouse", "Son", "Daughter", "Father", "Mother", "Brother", "Sister",
//           "Grandfather", "Grandmother", "Grandson", "Granddaughter", "Uncle", 
//           "Aunt", "Nephew", "Niece", "Cousin", "Son-in-law", "Daughter-in-law",
//           "Father-in-law", "Mother-in-law", "Other Relative", "Non-relative"
//         ];
      
//         const roles = [
//           "Student", "PWD (Person with Disability)", "Senior Citizen", "Working Adult",
//           "Unemployed", "Housewife/Househusband", "Retiree", "Self-employed",
//           "OFW (Overseas Filipino Worker)", "Minor", "Infant", "Other"
//         ];
      
//         const handleFamilySelect = (e) => {
//           setSelectedFamilyId(e.target.value);
//           setErrors(prev => ({ ...prev, familyId: '' }));
//         };
      
//         const handleMemberInputChange = (index, field, value) => {
//           const updatedMembers = [...familyMembers];
//           updatedMembers[index] = { ...updatedMembers[index], [field]: value };
          
//           // Clear search results when switching between existing/new resident
//           if (field === 'isExistingResident') {
//             updatedMembers[index].residentId = '';
//             updatedMembers[index].newResidentName = '';
//             updatedMembers[index].searchTerm = '';
//             setSearchResults(prev => ({ ...prev, [index]: [] }));
//           }
          
//           // Handle resident search
//           if (field === 'searchTerm' && value.length > 0) {
//             const filtered = availableResidents.filter(resident =>
//               resident.name.toLowerCase().includes(value.toLowerCase())
//             );
//             setSearchResults(prev => ({ ...prev, [index]: filtered }));
//           } else if (field === 'searchTerm') {
//             setSearchResults(prev => ({ ...prev, [index]: [] }));
//           }
          
//           setFamilyMembers(updatedMembers);
//         };
      
//         const handleResidentSelect = (index, resident) => {
//           const updatedMembers = [...familyMembers];
//           updatedMembers[index] = {
//             ...updatedMembers[index],
//             residentId: resident.id,
//             searchTerm: resident.name
//           };
//           setFamilyMembers(updatedMembers);
//           setSearchResults(prev => ({ ...prev, [index]: [] }));
//         };
      
//         const addMember = () => {
//           const newMember = {
//             id: familyMembers.length + 1,
//             residentId: '',
//             isExistingResident: true,
//             newResidentName: '',
//             relationship: '',
//             role: '',
//             searchTerm: ''
//           };
//           setFamilyMembers([...familyMembers, newMember]);
//         };
      
//         const removeMember = (index) => {
//           if (familyMembers.length > 1) {
//             const updatedMembers = familyMembers.filter((_, i) => i !== index);
//             setFamilyMembers(updatedMembers);
            
//             // Clean up search results
//             const updatedSearchResults = { ...searchResults };
//             delete updatedSearchResults[index];
//             setSearchResults(updatedSearchResults);
//           }
//         };
      
//         const validateForm = () => {
//           const newErrors = {};
          
//           if (!selectedFamilyId) {
//             newErrors.familyId = 'Please select a family';
//           }
          
//           familyMembers.forEach((member, index) => {
//             if (member.isExistingResident && !member.residentId) {
//               newErrors[`member_${index}_resident`] = 'Please select a resident';
//             }
            
//             if (!member.isExistingResident && !member.newResidentName.trim()) {
//               newErrors[`member_${index}_name`] = 'Please enter resident name';
//             }
            
//             if (!member.relationship) {
//               newErrors[`member_${index}_relationship`] = 'Please select relationship';
//             }
            
//             if (!member.role) {
//               newErrors[`member_${index}_role`] = 'Please select role';
//             }
//           });
          
//           setErrors(newErrors);
//           return Object.keys(newErrors).length === 0;
//         };
      
//         const handleSubmit = () => {
//           if (!validateForm()) {
//             return;
//           }
      
//           const submitData = {
//             familyId: selectedFamilyId,
//             members: familyMembers.map(member => ({
//               residentId: member.isExistingResident ? member.residentId : null,
//               newResidentName: member.isExistingResident ? null : member.newResidentName,
//               relationship: member.relationship,
//               role: member.role,
//               isExistingResident: member.isExistingResident
//             }))
//           };
      
//           console.log('Family Members Data Submitted:', submitData);
//           alert(`Successfully added ${familyMembers.length} member(s) to family ${selectedFamilyId}!`);
          
//           // Reset form
//           setSelectedFamilyId('');
//           setFamilyMembers([{
//             id: 1,
//             residentId: '',
//             isExistingResident: true,
//             newResidentName: '',
//             relationship: '',
//             role: '',
//             searchTerm: ''
//           }]);
//           setErrors({});
//           setSearchResults({});
//         };
      
//         const selectedFamily = existingFamilies.find(family => family.id === selectedFamilyId);
//   return (
//     <div>
//       <div className="flex gap-3">
//       <Button
//               onClick={handleSubmit}
//               variant="primary"
//               size="lg"
//               className="flex-1"
//               disabled={!selectedFamilyId}
//             >
//               <Users className="w-5 h-5 mr-2" />
//               Save Family Members ({familyMembers.length})
//             </Button>
            
//             <Button
//               onClick={() => {
//                 setSelectedFamilyId('');
//                 setFamilyMembers([{
//                   id: 1,
//                   residentId: '',
//                   isExistingResident: true,
//                   newResidentName: '',
//                   relationship: '',
//                   role: '',
//                   searchTerm: ''
//                 }]);
//                 setErrors({});
//                 setSearchResults({});
//               }}
//               variant="secondary"
//               outline
//               size="lg"
//             >
//               Reset Form
//             </Button>
//             </div>
//     </div>
//   )
// }
