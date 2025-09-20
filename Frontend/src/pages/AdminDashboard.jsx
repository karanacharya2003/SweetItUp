import React, { useState, useEffect } from 'react';
import {
  getAllSweets,
  createSweet,
  updateSweet,
  deleteSweet,
  restockSweet,
  searchSweets
} from '../api/sweets';
import { useCache } from '../context/CacheContext.jsx';
import { useDebounce } from '../hooks/useDebounce';
import toast from 'react-hot-toast';

// MODAL FOR ADD/EDIT
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all scale-100">
        <h2 className="text-2xl font-extrabold mb-6 text-gray-800">{mode === 'add' ? 'Add New Sweet' : `Edit ${sweet.name}`}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">Price (₹)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">Quantity (kg)</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required min="0" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-800 font-bold rounded-full hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-teal-500 text-white font-bold rounded-full hover:bg-teal-600">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// MODAL FOR RESTOCK
const RestockModal = ({ sweet, onClose, onRestock }) => {
    const [quantity, setQuantity] = useState(10);

    const handleRestock = () => {
        if (quantity && !isNaN(quantity) && Number(quantity) > 0) {
            onRestock(sweet.id, quantity);
        } else {
            toast.error("Please enter a valid quantity.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
                <h2 className="text-2xl font-extrabold mb-4 text-gray-800">Restock <span className="text-teal-500">{sweet.name}</span></h2>
                <p className="mb-6 text-gray-600">Current stock: {sweet.quantity} kg. How much would you like to add?</p>
                <div>
                    <label className="block text-sm font-bold text-gray-700">Quantity to Add (kg)</label>
                    <input 
                        type="number" 
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        min="1"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    />
                </div>
                <div className="flex justify-end space-x-4 pt-6">
                    <button onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-800 font-bold rounded-full hover:bg-gray-300">Cancel</button>
                    <button onClick={handleRestock} className="px-5 py-2 bg-green-500 text-white font-bold rounded-full hover:bg-green-600">Add Stock</button>
                </div>
            </div>
        </div>
    );
};

// MODAL FOR DELETE CONFIRMATION
const ConfirmDeleteModal = ({ sweet, onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
            <h2 className="text-2xl font-extrabold mb-4 text-gray-800">Are you sure?</h2>
            <p className="mb-6 text-gray-600">This will permanently delete <span className="font-bold">{sweet.name}</span>. This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
                <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 font-bold rounded-full hover:bg-gray-300">Cancel</button>
                <button onClick={() => onConfirm(sweet.id)} className="px-6 py-2 bg-red-600 text-white font-bold rounded-full hover:bg-red-700">Delete</button>
            </div>
        </div>
    </div>
);


const AdminDashboard = () => {
  const { invalidateCache } = useCache();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [modalState, setModalState] = useState({ type: null, sweet: null }); // type can be 'add', 'edit', 'restock', 'delete'

  // Search and Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSweets = async () => {
    setLoading(true);
    try {
      let response;
      if (debouncedSearchQuery.trim()) {
        response = await searchSweets(`name=${debouncedSearchQuery}`, currentPage);
      } else {
        response = await getAllSweets(currentPage);
      }

      const sweetsData = Array.isArray(response.data.sweets) ? response.data.sweets : [];
      const totalPagesData = response.data.totalPages || 1;
      
      setSweets(sweetsData);
      setTotalPages(totalPagesData);

    } catch (error) {
      console.error("Failed to fetch sweets:", error);
      toast.error("Could not fetch sweets.");
      setSweets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSweets(); }, [currentPage, debouncedSearchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleOpenModal = (type, sweet = null) => setModalState({ type, sweet });
  const handleCloseModal = () => setModalState({ type: null, sweet: null });
  
  const handleSaveSweet = async (formData) => {
    const isAdding = modalState.type === 'add';
    const actionPromise = isAdding 
        ? createSweet(formData) 
        : updateSweet(modalState.sweet.id, formData);

    toast.promise(actionPromise, {
        loading: `${isAdding ? 'Adding' : 'Updating'} sweet...`,
        success: `Sweet successfully ${isAdding ? 'added' : 'updated'}!`,
        error: `Failed to ${isAdding ? 'add' : 'update'} sweet.`
    });

    try {
        await actionPromise;
        invalidateCache();
        handleCloseModal();
        fetchSweets();
    } catch (error) {
        console.error('Failed to save sweet:', error);
    }
  };
  
  const handleDelete = async (sweetId) => {
    toast.promise(deleteSweet(sweetId), {
        loading: 'Deleting sweet...',
        success: 'Sweet deleted successfully!',
        error: 'Failed to delete sweet.'
    });

    try {
        await deleteSweet(sweetId);
        invalidateCache();
        handleCloseModal();
        fetchSweets();
    } catch (error) {
        console.error('Failed to delete sweet:', error);
    }
  };
  
  const handleRestock = async (sweetId, quantity) => {
     toast.promise(restockSweet(sweetId, { quantity }), {
        loading: 'Restocking...',
        success: 'Sweet restocked successfully!',
        error: 'Failed to restock.'
    });
     try {
        await restockSweet(sweetId, { quantity });
        invalidateCache();
        handleCloseModal();
        fetchSweets();
      } catch (error) {
        console.error('Failed to restock:', error);
      }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-extrabold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="relative flex-grow">
              <input 
                  type="text" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search sweets..."
                  className="w-full pl-10 pr-4 py-3 text-base bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
           </div>
           <button onClick={() => handleOpenModal('add')} className="flex-shrink-0 px-6 py-3 bg-teal-500 text-white font-bold rounded-full hover:bg-teal-600 shadow-md transition-transform transform hover:scale-105">
             + Add Sweet
           </button>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-2xl overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
             {loading ? (
                <tr><td colSpan="5" className="text-center py-10 text-gray-500">Loading...</td></tr>
             ) : sweets.length > 0 ? (
                sweets.map((sweet) => (
                  <tr key={sweet.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sweet.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sweet.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{sweet.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sweet.quantity} kg</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold space-x-4">
                      <button onClick={() => handleOpenModal('restock', sweet)} className="text-green-600 hover:text-green-800">Restock</button>
                      <button onClick={() => handleOpenModal('edit', sweet)} className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button onClick={() => handleOpenModal('delete', sweet)} className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                ))
             ) : (
                <tr><td colSpan="5" className="text-center py-10 text-gray-500">No sweets found.</td></tr>
             )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 font-bold">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md disabled:opacity-50 hover:bg-gray-100">Prev</button>
          <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md disabled:opacity-50 hover:bg-gray-100">Next</button>
        </div>
      )}

      {modalState.type === 'add' || modalState.type === 'edit' ? (
        <SweetFormModal
          sweet={modalState.sweet}
          mode={modalState.type}
          onClose={handleCloseModal}
          onSave={handleSaveSweet}
        />
      ) : null}
      
      {modalState.type === 'restock' ? (
        <RestockModal sweet={modalState.sweet} onClose={handleCloseModal} onRestock={handleRestock} />
      ) : null}

      {modalState.type === 'delete' ? (
        <ConfirmDeleteModal sweet={modalState.sweet} onClose={handleCloseModal} onConfirm={handleDelete} />
      ) : null}
    </div>
  );
};
export default AdminDashboard;