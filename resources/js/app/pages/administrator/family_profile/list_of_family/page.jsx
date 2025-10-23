import React, { useEffect, useState } from "react";
import Layout from "../../layout";
import { Eye, Save, Trash2, UserPlus, X, Edit } from "lucide-react";

export default function Page() {
  return (
    <Layout>
      <FamilyTable />
    </Layout>
  );
}

const mockFamilies = [
  {
    id: 1,
    familyNumber: 'F0001',
    headOfFamily: 'Juan Dela Cruz',
    sitio: 'Sitio A',
    street: 'Main Street',
    houseNumber: '123',
    members: [
      { id: 1, name: 'Juan Dela Cruz', relationship: 'Head', role: 'Father', residentId: 'R001' },
      { id: 2, name: 'Maria Dela Cruz', relationship: 'Spouse', role: 'Mother', residentId: 'R002' },
      { id: 3, name: 'Jose Dela Cruz', relationship: 'Child', role: 'Son', residentId: 'R003' }
    ],
    householdDetails: {
      incomeBracket: '₱15,000 - ₱30,000',
      houseType: 'Concrete',
      utilities: 'Electricity, Water',
      toiletType: 'Water-sealed',
      wasteDisposal: 'Garbage collection',
      notes: 'Family actively participates in community programs'
    }
  },
  {
    id: 2,
    familyNumber: 'F0002',
    headOfFamily: 'Ana Santos',
    sitio: 'Sitio B',
    street: 'Second Street',
    houseNumber: '456',
    members: [
      { id: 4, name: 'Ana Santos', relationship: 'Head', role: 'Mother', residentId: 'R004' },
      { id: 5, name: 'Pedro Santos', relationship: 'Child', role: 'Son', residentId: 'R005' }
    ],
    householdDetails: {
      incomeBracket: '₱8,000 - ₱15,000',
      houseType: 'Wood',
      utilities: 'Electricity',
      toiletType: 'Pit latrine',
      wasteDisposal: 'Burning',
      notes: 'Single parent household'
    }
  }
];

// View Family Modal
const ViewFamilyModal = ({ family, onClose }) => {
  if (!family) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Family Details</h2>
              <p className="text-blue-100 mt-1">Family #{family.familyNumber}</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-white hover:text-blue-200 bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Basic Information Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Family Information Card */}
            <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                Family Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-blue-200">
                  <span className="font-semibold text-blue-700">Family Number:</span>
                  <span className="text-blue-900">{family.familyNumber}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-blue-200">
                  <span className="font-semibold text-blue-700">Head of Family:</span>
                  <span className="text-blue-900">{family.headOfFamily}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-semibold text-blue-700">Address:</span>
                  <span className="text-blue-900 text-right">{family.houseNumber} {family.street}, {family.sitio}</span>
                </div>
              </div>
            </div>

            {/* Household Details Card */}
            <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                Household Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Income Bracket:</span>
                  <span className="text-gray-900">{family.householdDetails.incomeBracket}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">House Type:</span>
                  <span className="text-gray-900">{family.householdDetails.houseType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Utilities:</span>
                  <span className="text-gray-900">{family.householdDetails.utilities}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Toilet Type:</span>
                  <span className="text-gray-900">{family.householdDetails.toiletType}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-semibold text-gray-700">Waste Disposal:</span>
                  <span className="text-gray-900">{family.householdDetails.wasteDisposal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-xl border border-blue-200 overflow-hidden shadow-sm">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                Family Members ({family.members.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Relationship</th>
                    <th className="px-6 py-4 text-left font-semibold">Role</th>
                    <th className="px-6 py-4 text-left font-semibold">Resident ID</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-100">
                  {family.members.map((member, index) => (
                    <tr key={member.id} className={index % 2 === 0 ? 'bg-blue-25' : 'bg-white'}>
                      <td className="px-6 py-4 text-gray-900 font-medium">{member.name}</td>
                      <td className="px-6 py-4 text-gray-700">{member.relationship}</td>
                      <td className="px-6 py-4 text-gray-700">{member.role}</td>
                      <td className="px-6 py-4 text-blue-600 font-mono">{member.residentId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          {family.householdDetails.notes && (
            <div className="mt-8 bg-blue-50 rounded-xl p-6 border-l-4 border-blue-400">
              <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                Notes
              </h3>
              <p className="text-blue-900 leading-relaxed">{family.householdDetails.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Edit Family Modal
const EditFamilyModal = ({ family, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('family');
  const [editedFamily, setEditedFamily] = useState(family);

  useEffect(() => {
    setEditedFamily(family);
  }, [family]);

  const handleSave = () => {
    onSave(editedFamily);
  };

  const updateFamilyInfo = (field, value) => {
    setEditedFamily(prev => ({ ...prev, [field]: value }));
  };

  const updateHouseholdDetails = (field, value) => {
    setEditedFamily(prev => ({
      ...prev,
      householdDetails: { ...prev.householdDetails, [field]: value }
    }));
  };

  const addMember = () => {
    const newMember = {
      id: Date.now(),
      name: '',
      relationship: '',
      role: '',
      residentId: ''
    };
    setEditedFamily(prev => ({
      ...prev,
      members: [...prev.members, newMember]
    }));
  };

  const updateMember = (memberId, field, value) => {
    setEditedFamily(prev => ({
      ...prev,
      members: prev.members.map(member =>
        member.id === memberId ? { ...member, [field]: value } : member
      )
    }));
  };

  const removeMember = (memberId) => {
    setEditedFamily(prev => ({
      ...prev,
      members: prev.members.filter(member => member.id !== memberId)
    }));
  };

  if (!family) return null;

  const tabs = [
    { id: 'family', label: 'Family Info', icon: '🏠' },
    { id: 'members', label: 'Members', icon: '👥' },
    { id: 'household', label: 'Household Details', icon: '🏘️' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Edit Family</h2>
              <p className="text-blue-100 mt-1">Family #{family.familyNumber}</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-white hover:text-blue-200 bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="flex space-x-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'text-blue-700 bg-white border-b-3 border-blue-600' 
                    : 'text-blue-600 hover:text-blue-800 hover:bg-blue-100'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          {/* Family Info Tab */}
          {activeTab === 'family' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-blue-800 mb-6">Family Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block font-semibold text-blue-700">Head of Family</label>
                  <input
                    type="text"
                    value={editedFamily.headOfFamily}
                    onChange={(e) => updateFamilyInfo('headOfFamily', e.target.value)}
                    className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                    placeholder="Enter head of family name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-semibold text-blue-700">House Number</label>
                  <input
                    type="text"
                    value={editedFamily.houseNumber}
                    onChange={(e) => updateFamilyInfo('houseNumber', e.target.value)}
                    className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                    placeholder="Enter house number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-semibold text-blue-700">Street</label>
                  <input
                    type="text"
                    value={editedFamily.street}
                    onChange={(e) => updateFamilyInfo('street', e.target.value)}
                    className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                    placeholder="Enter street name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-semibold text-blue-700">Sitio</label>
                  <input
                    type="text"
                    value={editedFamily.sitio}
                    onChange={(e) => updateFamilyInfo('sitio', e.target.value)}
                    className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                    placeholder="Enter sitio"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-blue-800">Family Members</h3>
                <button
                  onClick={addMember}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <UserPlus size={20} />
                  <span>Add Member</span>
                </button>
              </div>

              <div className="space-y-4">
                {editedFamily.members.map((member, index) => (
                  <div key={member.id} className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-blue-800">Member #{index + 1}</h4>
                      <button
                        onClick={() => removeMember(member.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-lg transition-all duration-200"
                        title="Remove member"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="block font-semibold text-blue-700">Name</label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                          className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                          placeholder="Enter name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block font-semibold text-blue-700">Relationship</label>
                        <select
                          value={member.relationship}
                          onChange={(e) => updateMember(member.id, 'relationship', e.target.value)}
                          className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                        >
                          <option value="">Select relationship</option>
                          <option value="Head">Head</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Child">Child</option>
                          <option value="Parent">Parent</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block font-semibold text-blue-700">Role</label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                          className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                          placeholder="Enter role"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block font-semibold text-blue-700">Resident ID</label>
                        <input
                          type="text"
                          value={member.residentId}
                          onChange={(e) => updateMember(member.id, 'residentId', e.target.value)}
                          className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                          placeholder="Enter resident ID"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {editedFamily.members.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No family members added yet. Click "Add Member" to get started.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Household Details Tab */}
          {activeTab === 'household' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-blue-800 mb-6">Household Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block font-semibold text-blue-700">Income Bracket</label>
                  <select
                    value={editedFamily.householdDetails.incomeBracket}
                    onChange={(e) => updateHouseholdDetails('incomeBracket', e.target.value)}
                    className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                  >
                    <option value="">Select income bracket</option>
                    <option value="Below ₱8,000">Below ₱8,000</option>
                    <option value="₱8,000 - ₱15,000">₱8,000 - ₱15,000</option>
                    <option value="₱15,000 - ₱30,000">₱15,000 - ₱30,000</option>
                    <option value="₱30,000 - ₱50,000">₱30,000 - ₱50,000</option>
                    <option value="Above ₱50,000">Above ₱50,000</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block font-semibold text-blue-700">House Type</label>
                  <select
                    value={editedFamily.householdDetails.houseType}
                    onChange={(e) => updateHouseholdDetails('houseType', e.target.value)}
                    className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                  >
                    <option value="">Select house type</option>
                    <option value="Concrete">Concrete</option>
                    <option value="Wood">Wood</option>
                    <option value="Mixed">Mixed</option>
                    <option value="Bamboo">Bamboo</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block font-semibold text-blue-700">Utilities</label>
                  <input
                    type="text"
                    value={editedFamily.householdDetails.utilities}
                    onChange={(e) => updateHouseholdDetails('utilities', e.target.value)}
                    className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                    placeholder="e.g., Electricity, Water, Internet"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-semibold text-blue-700">Toilet Type</label>
                  <select
                    value={editedFamily.householdDetails.toiletType}
                    onChange={(e) => updateHouseholdDetails('toiletType', e.target.value)}
                    className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                  >
                    <option value="">Select toilet type</option>
                    <option value="Water-sealed">Water-sealed</option>
                    <option value="Pit latrine">Pit latrine</option>
                    <option value="Shared">Shared</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block font-semibold text-blue-700">Waste Disposal</label>
                  <select
                    value={editedFamily.householdDetails.wasteDisposal}
                    onChange={(e) => updateHouseholdDetails('wasteDisposal', e.target.value)}
                    className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                  >
                    <option value="">Select waste disposal method</option>
                    <option value="Garbage collection">Garbage collection</option>
                    <option value="Burning">Burning</option>
                    <option value="Composting">Composting</option>
                    <option value="Burial">Burial</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block font-semibold text-blue-700">Notes</label>
                <textarea
                  value={editedFamily.householdDetails.notes}
                  onChange={(e) => updateHouseholdDetails('notes', e.target.value)}
                  rows="4"
                  className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 resize-none"
                  placeholder="Additional notes about the family..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-blue-50 p-6 rounded-b-xl border-t border-blue-200">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-8 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center space-x-2 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Save size={18} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteFamilyModal = ({ family, onClose, onDelete }) => {
  if (!family) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Delete Family</h2>
              <p className="text-red-100 mt-1">Confirmation Required</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-white hover:text-red-200 bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} className="text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Are you sure you want to delete this family?
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="font-semibold text-red-800">
                Family #{family.familyNumber} – {family.headOfFamily}
              </p>
              <p className="text-red-600 text-sm mt-1">
                {family.members.length} family members • {family.sitio}
              </p>
            </div>
            <p className="text-gray-600 text-sm">
              This will permanently delete all family members and household details. This action cannot be undone.
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete(family.id)}
              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              Delete Family
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Family Table Component
const FamilyTable = () => {
  const [families, setFamilies] = useState(mockFamilies);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleView = (family) => {
    setSelectedFamily(family);
    setIsViewOpen(true);
  };

  const handleEdit = (family) => {
    setSelectedFamily(family);
    setIsEditOpen(true);
  };

  const handleDelete = (family) => {
    setSelectedFamily(family);
    setIsDeleteOpen(true);
  };

  const handleSave = (updatedFamily) => {
    setFamilies(prev => prev.map(family => 
      family.id === updatedFamily.id ? updatedFamily : family
    ));
    setIsEditOpen(false);
    setSelectedFamily(null);
  };

  const handleDeleteConfirm = (familyId) => {
    setFamilies(prev => prev.filter(family => family.id !== familyId));
    setIsDeleteOpen(false);
    setSelectedFamily(null);
  };

  const closeModals = () => {
    setIsViewOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setSelectedFamily(null);
  };

  return (
    <div className="  from-blue-50 to-white">
      <div className="p-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Family Management System</h1>
                <p className="text-blue-100 mt-2">Manage family records, members, and household details</p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="p-8 bg-blue-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 font-semibold">Total Families</p>
                    <p className="text-3xl font-bold text-blue-800">{families.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏠</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border-l-4 border-green-500 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 font-semibold">Total Members</p>
                    <p className="text-3xl font-bold text-green-800">
                      {families.reduce((total, family) => total + family.members.length, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border-l-4 border-purple-500 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 font-semibold">Average Family Size</p>
                    <p className="text-3xl font-bold text-purple-800">
                      {families.length > 0 ? Math.round((families.reduce((total, family) => total + family.members.length, 0) / families.length) * 10) / 10 : 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-50 border-b border-blue-200 p-6">
            <h2 className="text-xl font-bold text-blue-800 flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
              Family Records
            </h2>
          </div>

          {families.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Family No.</th>
                    <th className="px-6 py-4 text-left font-semibold">Head of Family</th>
                    <th className="px-6 py-4 text-left font-semibold">Members</th>
                    <th className="px-6 py-4 text-left font-semibold">Address</th>
                    <th className="px-6 py-4 text-left font-semibold">Income Bracket</th>
                    <th className="px-6 py-4 text-left font-semibold">House Type</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-100">
                  {families.map((family, index) => (
                    <tr key={family.id} className={`hover:bg-blue-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-blue-25' : 'bg-white'}`}>
                      <td className="px-6 py-4">
                        <span className="text-blue-600 font-mono font-semibold">{family.familyNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{family.headOfFamily}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {family.members.length} member{family.members.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <div className="text-sm">
                          <div>{family.houseNumber} {family.street}</div>
                          <div className="text-gray-500">{family.sitio}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{family.householdDetails.incomeBracket}</td>
                      <td className="px-6 py-4 text-gray-700">{family.householdDetails.houseType}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleView(family)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded-lg transition-all duration-200"
                            title="View Family Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(family)}
                            className="text-green-600 hover:text-green-800 hover:bg-green-100 p-2 rounded-lg transition-all duration-200"
                            title="Edit Family"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(family)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded-lg transition-all duration-200"
                            title="Delete Family"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Families Found</h3>
              <p className="text-gray-600">Add some families to get started with your family management system.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isViewOpen && (
        <ViewFamilyModal
          family={selectedFamily}
          onClose={closeModals}
        />
      )}

      {isEditOpen && (
        <EditFamilyModal
          family={selectedFamily}
          onClose={closeModals}
          onSave={handleSave}
        />
      )}

      {isDeleteOpen && (
        <DeleteFamilyModal
          family={selectedFamily}
          onClose={closeModals}
          onDelete={handleDeleteConfirm}
        />
      )}
    </div>
  );
};