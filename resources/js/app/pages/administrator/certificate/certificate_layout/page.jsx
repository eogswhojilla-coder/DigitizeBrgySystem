import React, { useState, useEffect } from 'react';
import Layout from '../../layout';
import { Plus, Printer } from 'lucide-react';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCertificateTypes, createCertificateType } from '@/app/redux/certificate-type-thunk';
import axios from 'axios';

export default function Page() {
  const dispatch = useDispatch();
  const { certificateTypes, loading, error } = useSelector(state => state.certificateTypes);
  const [showModal, setShowModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fee: ''
  });
  const [printData, setPrintData] = useState({
    resident_name: '',
    resident_address: '',
    purpose: ''
  });
  const [errors, setErrors] = useState({});
  const [printErrors, setPrintErrors] = useState({});

  useEffect(() => {
    dispatch(fetchCertificateTypes());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error
      });
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePrintCertificate = (type) => {
    setSelectedType(type);
    setShowPrintModal(true);
    setPrintData({
      resident_name: '',
      resident_address: '',
      purpose: ''
    });
    setPrintErrors({});
  };

  const handlePrintSubmit = async (e) => {
    e.preventDefault();

    // Validate
    let newErrors = {};
    if (!printData.resident_name.trim()) {
      newErrors.resident_name = 'Resident name is required';
    }
    if (!printData.resident_address.trim()) {
      newErrors.resident_address = 'Resident address is required';
    }
    if (!printData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setPrintErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('/api/certificates/generate-direct', {
        certificate_type_id: selectedType.id,
        ...printData
      }, {
        responseType: 'blob' // Important for receiving PDF
      });

      // Create blob URL and open in new window
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');

      // Clean up
      setShowPrintModal(false);
      setPrintData({
        resident_name: '',
        resident_address: '',
        purpose: ''
      });

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Certificate has been generated.',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to generate certificate'
      });
    }
  };

  const handlePrintChange = (e) => {
    const { name, value } = e.target;
    setPrintData(prev => ({
      ...prev,
      [name]: value
    }));
    if (printErrors[name]) {
      setPrintErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    let newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.fee || formData.fee <= 0) {
      newErrors.fee = 'Fee is required and must be greater than 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(createCertificateType({
        name: formData.name,
        description: formData.description,
        fee: parseFloat(formData.fee)
      })).unwrap();

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Certificate type has been added.',
      });

      // Clear form and close modal
      setFormData({ name: '', description: '', fee: '' });
      setShowModal(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Something went wrong'
      });
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Certificate Types</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Certificate Type
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Add Certificate Type</h2>
              </div>

              <form onSubmit={handleSubmit} className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-lg ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Fee</label>
                    <input
                      type="number"
                      name="fee"
                      value={formData.fee}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full p-2 border rounded-lg ${
                        errors.fee ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.fee && (
                      <p className="text-red-500 text-sm mt-1">{errors.fee}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table for displaying certificate types */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : certificateTypes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No certificate types found
                  </td>
                </tr>
              ) : (
                certificateTypes.map((type) => (
                  <tr key={type.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {type.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {type.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₱{parseFloat(type.fee).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handlePrintCertificate(type)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Print Certificate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Print Certificate Modal */}
        {showPrintModal && selectedType && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Print {selectedType.name}</h2>
              </div>

              <form onSubmit={handlePrintSubmit} className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Resident Name</label>
                    <input
                      type="text"
                      name="resident_name"
                      value={printData.resident_name}
                      onChange={handlePrintChange}
                      className={`w-full p-2 border rounded-lg ${
                        printErrors.resident_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {printErrors.resident_name && (
                      <p className="text-red-500 text-sm mt-1">{printErrors.resident_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Resident Address</label>
                    <input
                      type="text"
                      name="resident_address"
                      value={printData.resident_address}
                      onChange={handlePrintChange}
                      className={`w-full p-2 border rounded-lg ${
                        printErrors.resident_address ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {printErrors.resident_address && (
                      <p className="text-red-500 text-sm mt-1">{printErrors.resident_address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Purpose</label>
                    <textarea
                      name="purpose"
                      value={printData.purpose}
                      onChange={handlePrintChange}
                      rows="3"
                      className={`w-full p-2 border rounded-lg ${
                        printErrors.purpose ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {printErrors.purpose && (
                      <p className="text-red-500 text-sm mt-1">{printErrors.purpose}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowPrintModal(false)}
                    className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
