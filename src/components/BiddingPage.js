import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import './Bidding.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BiddingPage = ({ darkMode }) => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    startingBid: '',
    currentBid: '',
    endTime: '',
  });
  
  const { loggedIn, userId } = useAuth();
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState(localStorage.getItem('bidAmount') || ''); // Use local storage for bid amount
  const [modifyProductId, setModifyProductId] = useState(null); // Track the product being modified
  const [currentBid, setCurrentBid] = useState(localStorage.getItem('currentBid') || '');

  // Fetch products from the server when the component mounts
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:5500/api/getBids?userId=${userId}`);
      setProducts(response.data.bids);
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // The empty dependency array ensures that this effect runs only once when the component mounts

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };



  const handleAddProduct = async () => {
    if (loggedIn) {
      const { startingBid, currentBid , name, description,endTime } = newProduct;

      // Validate that all required fields are filled
    if (!name || !description || !startingBid || !currentBid || !endTime) {
      alert('Please fill all the required bid details first.');
      return;
    }
  
      // Convert currentBid and startingBid to numbers
      const numericStartingBid = parseInt(startingBid);
      const numericCurrentBid = parseInt(currentBid);

      console.log('startingBid:', startingBid);
    console.log('currentBid:', currentBid);
    console.log('numericStartingBid:', numericStartingBid);
    console.log('numericCurrentBid:', numericCurrentBid);
  
      // Check if the current bid is less than the starting bid
      if (numericCurrentBid < numericStartingBid) {
        alert('Current bid must be greater than or equal to the starting bid');
        return;
      }
  
      try {
        const response = await axios.post('http://localhost:5500/api/addBid', {
          ...newProduct,
          userId,
          currentBid: numericCurrentBid || numericStartingBid, // Set currentBid to startingBid if not provided
        });
  
        if (response.status === 200) {
          alert('Bid added successfully');
          const updatedProducts = [...products, { ...response.data.bid }];
          setProducts(updatedProducts);
          localStorage.setItem('products', JSON.stringify(updatedProducts)); // Store in localStorage
        } else {
          alert('Failed to add bid');
        }
      } catch (err) {
        console.error('Error adding bid:', err);
        alert('An error occurred while adding bid');
      }
    } else {
      alert('Please login first');
      navigate('/login'); // Redirect to login page
    }
  };
  
  
  

  const handleDeleteProduct = async (productId) => {
    if (loggedIn) {
      try {
        const response = await axios.delete(`http://localhost:5500/api/deleteBid/${productId}`);
        if (response.status === 200) {
          alert('Bid deleted successfully');
          // Update state immediately after successful deletion
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== productId)
          );
        } else {
          alert('Failed to delete bid');
        }
      } catch (error) {
        console.error('Error deleting bid:', error);
        alert('An error occurred while deleting bid');
      }
    } else {
      alert('Please login first');
      navigate('/login'); // Redirect to login page
    }
  };

  const handleModifyBid = (productId, newBid) => {
    setModifyProductId(productId); // Set the product being modified
  };

  const handleConfirmModifyBid = (productId, newBid) => {
    axios
      .put(`http://localhost:5500/api/modifyBid/${productId}`, {
        newBid,
        currentBid: bidAmount, // Pass the currentBid along with newBid
      })
      .then((res) => {
        if (res.status === 200) {
          // Check if bidding has ended
        if (res.data.message === 'Bidding for this product has already ended. Modification not allowed.') {
          alert(res.data.message);
          return;
        }
          alert('Bid modified successfully');
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product._id === productId
                ? { ...product, startingBid: parseInt(newBid), currentBid: parseInt(bidAmount) } // Update both startingBid and currentBid
                : product
            )
          );
          setModifyProductId(null); // Clear the product being modified
        } else {
          Promise.reject();
        }
      })
      .catch((err) => {
        // Handle Axios errors with a response
        if (err.response) {
          const errorMessage = err.response.data.message || 'An error occurred while modifying bid';
          alert(errorMessage);
        } else {
          // Handle other errors
          alert('An error occurred while modifying bid');
        }
      });
  };
  

  const handlePlaceBid = (productId, currentBid) => {
    // Logic to check if bidAmount is greater than startingBid
    if (bidAmount <= currentBid) {
      alert('Bid amount must be greater than the current bid');
      return;
    }

    axios
      .post('http://localhost:5500/api/placeBid', {
        productId,
        userId: userId, // Use userId from useAuth
        bidAmount,
      })
      .then((res) => {
        if (res.status === 200) {
          alert('Bid placed successfully');
          // Refresh product data after placing bid
          fetchProducts();
          setBidAmount(''); // Clear bid amount after placing bid
          localStorage.removeItem('bidAmount'); // Remove bid amount from local storage
        } else {
          alert('Failed to place bid');
        }
      })
      .catch((err) => {
        console.error('Error placing bid:', err);
        alert('An error occurred while placing bid');
      });
  };

  return (
    <div className={`bidding-page ${darkMode ? 'dark-mode' : ''}`}>
      <h2>Add Product for Auction</h2>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={newProduct.name || ''} onChange={handleInputChange} />
      </div>
      <div>
        <label>Description:</label>
        <input type="text" name="description" value={newProduct.description || ''} onChange={handleInputChange} />
      </div>
      <div>
        <label>Starting Bid:</label>
        <input type="number" name="startingBid" value={newProduct.startingBid || ''} onChange={handleInputChange} />
      </div>
      <div>
        <label>Current Bid:</label>
        <input
        type="number"
        name="currentBid"
        value={newProduct.currentBid}
        onChange={handleInputChange}
        />
        </div>
      <div>
        <label>End Time:</label>
        <input type="datetime-local" name="endTime" value={newProduct.endTime || ''} onChange={handleInputChange} />
      </div>
      
      <button onClick={handleAddProduct}>Add Product</button>
      <pre></pre>

      <h3>Products you have added :</h3> <pre></pre>
      {products.map(product => (
        // Only render products associated with the logged-in user
  product.userId === userId && (
        <div key={product._id} className="product">
          
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Starting Bid: ${product.startingBid}</p>
          <p>Current Bid: ${product.currentBid}</p>
          {modifyProductId === product._id ?(
          <div>
            <label>Enter Your Modified Bid:</label>
            <input
              type="number"
              value={bidAmount}
              onChange={(e)=> {setBidAmount(e.target.value);
              localStorage.setItem('bidAmount', e.target.value); // Store bid amount in local storage
              }}
            />
            <button onClick={() => handleConfirmModifyBid(product._id, bidAmount)}>
                Confirm Modification
              </button>
          </div>
          ) : (
            <button onClick={() => handleModifyBid(product._id, product.currentBid)}>
              Modify Bid
            </button>
          )}
          <button onClick={() => handleDeleteProduct(product._id)}>Delete Product</button>
        </div>
  )
      ))}
    </div>
  );
};

export default BiddingPage;