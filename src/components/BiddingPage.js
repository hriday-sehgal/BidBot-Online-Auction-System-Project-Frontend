import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import './Bidding.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';

const BiddingPage = ({ darkMode }) => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    startingBid: '',
    currentBid: '',
    endTime: '',
  });
  const [loading, setLoading] = useState(true);

  const { loggedIn, userId } = useAuth();
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState('');
  const [modifyProductId, setModifyProductId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`https://backend-online-auction-system-mern.onrender.com/api/getBids?userId=${userId}`);
      setProducts(response.data.bids);
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast.error('Error fetching bids');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = async () => {
    if (loggedIn) {
      const { startingBid, currentBid, name, description, endTime } = newProduct;

      if (!name || !description || !startingBid || !currentBid || !endTime) {
        toast.error('Please fill all the required bid details first.');
        return;
      }

      const numericStartingBid = parseInt(startingBid);
      const numericCurrentBid = parseInt(currentBid);

      if (numericCurrentBid < numericStartingBid) {
        toast.error('Current bid must be greater than or equal to the starting bid');
        return;
      }

      try {
        const response = await axios.post('https://backend-online-auction-system-mern.onrender.com/api/addBid', {
          ...newProduct,
          userId,
          currentBid: numericCurrentBid || numericStartingBid,
        });

        if (response.status === 200) {
          toast.success('Bid added successfully');
          const updatedProducts = [...products, response.data.bid];
          setProducts(updatedProducts);
          localStorage.setItem('products', JSON.stringify(updatedProducts));
        } else {
          toast.error('Failed to add bid');
        }
      } catch (err) {
        console.error('Error adding bid:', err);
        toast.error('An error occurred while adding bid');
      }
    } else {
      toast.error('Please login first');
      setTimeout(() => {
        navigate('/login');
      }, 1800);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (loggedIn) {
      try {
        const response = await axios.delete(`https://backend-online-auction-system-mern.onrender.com/api/deleteBid/${productId}`);
        if (response.status === 200) {
          toast.success('Bid deleted successfully');
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== productId)
          );
        } else {
          toast.error('Failed to delete bid');
        }
      } catch (error) {
        console.error('Error deleting bid:', error);
        toast.error('An error occurred while deleting bid');
      }
    } else {
      toast.error('Please login first');
      navigate('/login');
    }
  };

  const handleModifyBid = (productId) => {
    setModifyProductId(productId);
  };

  const handleConfirmModifyBid = async () => {
    if (isNaN(bidAmount) || bidAmount <= 0) {
      toast.error('Please enter a valid bid amount.');
      return;
    }

    const product = products.find(p => p._id === modifyProductId);
    if (!product) {
      toast.error('Product not found');
      return;
    }

    if (new Date(product.endTime) < new Date()) {
      toast.error('Cannot modify as bidding has already ended for the product.');
      setModifyProductId(null);
      return;
    }

    if (parseInt(bidAmount) <= product.currentBid) {
      toast.error('Bid amount must be greater than the current bid.');
      return;
    }

    try {
      const response = await axios.put(`https://backend-online-auction-system-mern.onrender.com/api/modifyBid/${modifyProductId}`, {
        newBid: bidAmount,
      });

      if (response.status === 200) {
        toast.success('Bid modified successfully');
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === modifyProductId
              ? { ...product, currentBid: parseInt(bidAmount) }
              : product
          )
        );
        setModifyProductId(null);
      } else {
        toast.error('Failed to modify bid');
      }
    } catch (err) {
      console.error('Error modifying bid:', err);
      toast.error('An error occurred while modifying bid');
    }
  };

  return (
    <div className={`bidding-page ${darkMode ? 'dark-mode' : ''}`}>
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      <h2>Add Product for Auction</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={newProduct.name || ''}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={newProduct.description || ''}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Starting Bid:</label>
        <input
          type="number"
          name="startingBid"
          value={newProduct.startingBid || ''}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Current Bid:</label>
        <input
          type="number"
          name="currentBid"
          value={newProduct.currentBid || ''}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>End Time:</label>
        <input
          type="datetime-local"
          name="endTime"
          value={newProduct.endTime || ''}
          onChange={handleInputChange}
        />
      </div>
      
      <button onClick={handleAddProduct}>Add Product</button>
      <pre></pre>

      <h3>Products you have added:</h3>
      <pre></pre>
      {loading ? (
        <div className="loading-container">
          <ClipLoader size={50} color="#123abc" loading={loading} />
        </div>
      ) : (
        products.map(product => (
          product.userId === userId && (
            <div key={product._id} className="product">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Starting Bid: ${product.startingBid}</p>
              <p>Current Bid: ${product.currentBid}</p>
              {modifyProductId === product._id ? (
                <div className="modify-bid-container">
                  <label>Enter Your Modified Bid:</label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                  />
                  <button onClick={handleConfirmModifyBid}>
                    Confirm Modification
                  </button>
                  <button onClick={() => setModifyProductId(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="buttons">
                  <button className="modify" onClick={() => handleModifyBid(product._id)}>
                    Modify Bid
                  </button>
                  <button className="delete" onClick={() => handleDeleteProduct(product._id)}>
                    Delete Product
                  </button>
                </div>
              )}
            </div>
          )
        ))
      )}
    </div>
  );
};

export default BiddingPage;
