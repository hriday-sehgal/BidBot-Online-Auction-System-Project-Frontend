import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Product.css';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductsPage = ({ darkMode }) => {
  const [products, setProducts] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userBids, setUserBids] = useState([]);
  const [modifyProductId, setModifyProductId] = useState(null);
  const [newBidAmount, setNewBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [placingBid, setPlacingBid] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const navigate = useNavigate();
  const auth = useAuth();
  const userId = auth.userId;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://backend-online-auction-system-mern.onrender.com/api/getBids');
        console.log('API Response:', response.data);
        setProducts(response.data.bids);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request aborted:', error.message);
        } else {
          console.error('Error fetching bids:', error);
          toast.error('Error fetching bids');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const fetchUserBids = async () => {
      try {
        if (userId) {
          const userBidsResponse = await axios.get(`https://backend-online-auction-system-mern.onrender.com/api/getUserBids/${userId}`);
          console.log('User Bids:', userBidsResponse.data.userBids);
          setUserBids(userBidsResponse.data.userBids);
        }
      } catch (error) {
        console.error('Error fetching user bids:', error);
        toast.error('Error fetching user bids');
      }
    };

    fetchUserBids();
  }, [userId]);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    console.log('Filtered Products:', filtered);
  }, [searchTerm, products]);

  const handleBid = async (productId, currentBid, startingBid) => {
    if (!auth.loggedIn) {
      toast.info('Please log in to place a bid.');
      setTimeout(() => {
        navigate('/login');
      }, 1800);
      return;
    }

    const product = products.find((p) => p._id === productId);
    if (!product) {
      toast.error('Product not found in the list');
      return;
    }

    if (product.endTime && new Date(product.endTime) < new Date()) {
      toast.info('Bidding for this product has already ended.');
      return;
    }

    setShowBidModal(true);
    setSelectedProduct({ productId, currentBid, startingBid });
  };

  const placeBid = async () => {
    if (!auth.loggedIn) {
      toast.info('Please log in to place a bid.');
      navigate('/login');
      return;
    }

    if (!selectedProduct) {
      toast.error('Invalid product');
      return;
    }

    const product = products.find((p) => p._id === selectedProduct.productId);
    if (!product) {
      toast.error('Product not found in the list');
      return;
    }

    const startingBid = Number(product.startingBid);

    if (Number(bidAmount) <= startingBid) {
      toast.error(`Bid amount must be greater than the starting bid of ${startingBid}`);
      return;
    }

    if (Number(bidAmount) <= product.currentBid) {
      toast.error(`Bid amount must be greater than the current bid of ${product.currentBid}`);
      return;
    }

    setPlacingBid(true);
    try {
      const response = await axios.post('https://backend-online-auction-system-mern.onrender.com/api/placeBid', {
        productId: selectedProduct.productId,
        userId: userId,
        bidAmount: Number(bidAmount),
      });

      if (response.status === 200) {
        const updatedProducts = products.map((p) =>
          p._id === selectedProduct.productId ? { ...p, currentBid: Number(bidAmount) } : p
        );
        setProducts(updatedProducts);

        const updatedUserBidsResponse = await axios.get(`https://backend-online-auction-system-mern.onrender.com/api/getUserBids/${userId}`);
        setUserBids(updatedUserBidsResponse.data.userBids);

        setShowBidModal(false);
        setBidAmount('');
        toast.success('Bid placed successfully');
      } else {
        toast.error('Failed to place bid');
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error('An error occurred while placing bid');
    } finally {
      setPlacingBid(false);
    }
  };

  const handleConfirmModifyBid = async () => {
    if (!modifyProductId || !newBidAmount) return;

    const product = products.find((p) => p._id === modifyProductId);
    if (!product) {
      toast.error('Product not found in the list');
      return;
    }

    const currentBid = Number(product.currentBid);

    if (Number(newBidAmount) <= currentBid) {
      toast.error(`New bid amount must be greater than the current bid of ${currentBid}`);
      return;
    }

    try {
      const res = await axios.put(`https://backend-online-auction-system-mern.onrender.com/api/modifyBid/${modifyProductId}`, {
        newBid: Number(newBidAmount),
      });

      if (res.status === 200) {
        toast.success('Bid modified successfully');
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === modifyProductId ? { ...product, currentBid: Number(newBidAmount) } : product
          )
        );
        setModifyProductId(null);
        setNewBidAmount('');

        const updatedUserBidsResponse = await axios.get(`https://backend-online-auction-system-mern.onrender.com/api/getUserBids/${userId}`);
        setUserBids(updatedUserBidsResponse.data.userBids);
      } else {
        toast.error('Failed to modify bid');
      }
    } catch (error) {
      console.error('Error modifying bid:', error);
      toast.error('An error occurred while modifying bid');
    }
  };

  const closeModal = () => {
    setShowBidModal(false);
    setSelectedProduct(null);
  };

  const isBidPeriodEnded = (endTime) => {
    return endTime && new Date(endTime) < new Date();
  };

  const handleModifyBidClick = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product && isBidPeriodEnded(product.endTime)) {
      toast.info('Bidding for this product has already ended.');
    } else {
      setModifyProductId(productId);
    }
  };

  const calculateRemainingTime = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return 'Bidding has ended';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProducts((prevProducts) =>
        prevProducts.map((product) => ({
          ...product,
          remainingTime: calculateRemainingTime(product.endTime),
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [products]);

  if (loading) {
    return (
      <div className="loading-container">
        <ClipLoader size={50} color="#123abc" loading={loading} />
      </div>
    );
  }

  return (
    <div className={`container ${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
      <ToastContainer />
      <div className="mb-4">
        <h2 className="text-center">Products</h2>
      </div>
      <input
        type="text"
        placeholder="Search by product name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control mb-4"
      />
      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="col-md-4 mb-4" key={product._id}>
              <div className={`card h-100 ${darkMode ? 'bg-secondary text-white' : 'bg-light text-dark'}`}>
                <div className="card-body">
                  {product.name ? (
                    <>
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">{product.description}</p>
                      <p className="card-text">Starting Bid: ${product.startingBid}</p>
                      <p className="card-text">Current Bid: ${product.currentBid || 'Not set'}</p>
                      <p className="card-text">End Time: {new Date(product.endTime).toLocaleString()}</p>
                      {isBidPeriodEnded(product.endTime) ? (
                        <p className="card-text text-danger">Bidding has ended</p>
                      ) : (
                        <p className="card-text">Time Left: {product.remainingTime}</p>
                      )}
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleBid(product._id, product.currentBid || 0, product.startingBid)}
                        >
                          Place Bid
                        </button>
                        {userBids.find(bid => bid.productId === product._id) && (
                          <button
                            className="btn btn-warning"
                            onClick={() => handleModifyBidClick(product._id)}
                          >
                            Modify Your Bid
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="card-text">Product name is not available</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p>No products found.</p>
          </div>
        )}
      </div>

      {showBidModal && (
        <div className="modal-overlay">
          <div className={`modal-dialog ${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Place Bid</h5>
                <button type="button" className="close" onClick={closeModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Current Bid: ${selectedProduct.currentBid}</p>
                <p>Starting Bid: ${selectedProduct.startingBid}</p>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter your bid amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={placeBid} disabled={placingBid}>
                  {placingBid ? 'Placing Bid...' : 'Place Bid'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modifyProductId && (
        <div className="modal-overlay">
          <div className={`modal-dialog ${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modify Bid</h5>
                <button type="button" className="close" onClick={() => setModifyProductId(null)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Current Bid: ${products.find((p) => p._id === modifyProductId)?.currentBid}</p>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter new bid amount"
                  value={newBidAmount}
                  onChange={(e) => setNewBidAmount(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModifyProductId(null)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleConfirmModifyBid}>
                  Modify Bid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
