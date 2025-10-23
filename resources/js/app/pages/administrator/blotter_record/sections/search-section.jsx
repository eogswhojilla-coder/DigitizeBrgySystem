import React, { useState } from 'react'

export default function SearchSection() {
const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});

  const records = [
    {
      id: 1,
      blotterNumber: '2066133803768924',
      status: 'NEW',
      remarks: 'OPEN',
      incident: 'qewr',
      location: 'San Carlos',
      dateIncident: '04/25/2025 - 05:43 PM',
      dateReported: '04/25/2025 - 05:43 PM'
    },
    {
      id: 2,
      blotterNumber: '4108081920533098',
      status: 'NEW',
      remarks: 'OPEN',
      incident: 'Sdaasd',
      location: 'Sad',
      dateIncident: '04/11/2025 - 04:09 PM',
      dateReported: '04/25/2025 - 07:10 AM'
    }
  ];

  const handleSelectAll = (checked) => {
    setSelectedItems(checked ? records.map(r => r.id) : []);
  };

  const handleSelectItem = (id, checked) => {
    setSelectedItems(prev =>
      checked ? [...prev, id] : prev.filter(item => item !== id)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
    setShowModal(false);
    // Reset form or show success message
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredRecords = records.filter(record =>
    Object.values(record).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  return (

    <div>
      
    </div>
  )
}

