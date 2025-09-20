// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  getAllSweets,
  createSweet,
  updateSweet,
  deleteSweet,
  restockSweet
} from '../api/sweets';

// SweetFormModal component remains unchanged.
const SweetFormModal = ({ sweet, mode, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: sweet?.name || '',
    category: sweet?.category || '',
    price: sweet?.price || '',
    quantity: sweet?.quantity || 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{mode === 'add' ? 'Add New Sweet' : 'Edit Sweet'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const AdminDashboard = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentSweet, setCurrentSweet] = useState(null);

  // New: State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSweets = async () => {
    setLoading(true);
    try {
      const response = await getAllSweets(currentPage); // Fetch the current page
      
      const sweetsData = Array.isArray(response.data) ? response.data : response.data.sweets;
      const totalPagesData = response.data.totalPages || 1;

      setSweets(Array.isArray(sweetsData) ? sweetsData : []);
      setTotalPages(totalPagesData);

    } catch (error) {
      console.error("Failed to fetch sweets:", error);
      alert("Could not load sweets data.");
      setSweets([]);
    } finally {
      setLoading(false);
    }
  };

  // Update useEffect to re-fetch when currentPage changes
  useEffect(() => {
    fetchSweets();
  }, [currentPage]);

  // New: Function to handle page changes
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
  };

  const handleOpenModal = (mode, sweet = null) => {
    setModalMode(mode);
    setCurrentSweet(sweet);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSweet(null);
  };

  const handleSaveSweet = async (formData) => {
    try {
      if (modalMode === 'add') {
        await createSweet(formData);
        alert('Sweet added successfully!');
      } else {
        await updateSweet(currentSweet.id, formData);
        alert('Sweet updated successfully!');
      }
      handleCloseModal();
      fetchSweets();
    } catch (error) {
      console.error('Failed to save sweet:', error);
      alert(error.response?.data?.message || 'An error occurred.');
    }
  };

  const handleDelete = async (sweetId) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await deleteSweet(sweetId);
        alert('Sweet deleted successfully!');
        fetchSweets();
      } catch (error) {
        console.error('Failed to delete sweet:', error);
        alert(error.response?.data?.message || 'Could not delete sweet.');
      }
    }
  };

  const handleRestock = async (sweetId) => {
    const quantity = window.prompt('Enter the quantity to add:');
    if (quantity && !isNaN(quantity) && Number(quantity) > 0) {
      try {
        await restockSweet(sweetId, { quantity });
        alert('Stock updated!');
        fetchSweets();
      } catch (error) {
        console.error('Failed to restock:', error);
        alert(error.response?.data?.message || 'Restock failed.');
      }
    } else if (quantity !== null) {
      alert('Please enter a valid number.');
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading Admin Panel...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button onClick={() => handleOpenModal('add')} className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 shadow-md">
          + Add New Sweet
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sweets.map((sweet) => (
              <tr key={sweet.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sweet.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sweet.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{sweet.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sweet.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => handleRestock(sweet.id)} className="text-green-600 hover:text-green-900">Restock</button>
                  <button onClick={() => handleOpenModal('edit', sweet)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button onClick={() => handleDelete(sweet.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New: Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1} 
            className="px-4 py-2 bg-pink-500 text-white rounded-md disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="font-semibold">Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages} 
            className="px-4 py-2 bg-pink-500 text-white rounded-md disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}

      {isModalOpen && (
        <SweetFormModal
          sweet={currentSweet}
          mode={modalMode}
          onClose={handleCloseModal}
          onSave={handleSaveSweet}
        />
      )}
    </div>
  );
};

export default AdminDashboard;