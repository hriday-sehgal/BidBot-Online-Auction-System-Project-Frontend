import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { ClipLoader } from 'react-spinners';
import './UserBids.css'; // Import the CSS file for custom styles

const UserBidsPage = ({ darkMode }) => {
  const [userBids, setUserBids] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredBids, setFilteredBids] = useState([]);
  const [filterOption, setFilterOption] = useState('all');
  const [loading, setLoading] = useState(true); // Add loading state
  const auth = useAuth();
  const userId = auth.userId;

  useEffect(() => {
    const fetchUserBids = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        if (userId) {
          const userBidsResponse = await axios.get(`https://backend-online-auction-system-mern.onrender.com/api/getUserBids/${userId}`);
          setUserBids(userBidsResponse.data.userBids);
          setFilteredBids(userBidsResponse.data.userBids);

          const filtered =
            filterOption === 'winning'
              ? userBidsResponse.data.userBids.filter((bid) => bid.isWinningBid)
              : userBidsResponse.data.userBids;

          setFilteredBids(filtered);
        }
      } catch (error) {
        console.error('Error fetching user bids:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchUserBids();
  }, [userId, filterOption]);

  const handleSearch = () => {
    const filtered = userBids.filter((bid) =>
      bid.productName.toLowerCase().includes(searchInput.toLowerCase()) ||
      bid.bidAmount.toString().includes(searchInput)
    );
    setFilteredBids(filtered);
  };

  const handleFilterChange = (option) => {
    setFilterOption(option);
  };

  return (
    <div className={`container mt-4 ${darkMode ? 'dark-mode' : ''}`}>
      <h2 className="text-center">Your Bids</h2><br></br>
      <Row className="mb-4">
        <Col md={8}>
          <Form>
            <Form.Group controlId="searchInput">
              <Form.Control
                type="text"
                placeholder="Search by product name or bid amount"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Col>
        <Col md={2}>
          <Button variant="primary" onClick={handleSearch} className="w-100">
            Search
          </Button>
        </Col>
        <Col md={2}>
          <Form>
            <Form.Group controlId="filterDropdown">
              <Form.Select onChange={(e) => handleFilterChange(e.target.value)} value={filterOption}>
                <option value="all">All bids</option>
                <option value="winning">Winning bids</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Col>
      </Row>

      {loading ? (
        <div className="loading-container">
          <ClipLoader size={50} color="#123abc" loading={loading} />
        </div>
      ) : (
        <div className="row">
          {filteredBids.length > 0 ? (
            filteredBids.map((bid) => (
              <div key={bid._id} className="col-md-4 mb-4">
                <Card className={`h-100 ${darkMode ? 'bg-dark text-light' : ''}`}>
                  <Card.Body>
                    <Card.Title>{bid.productName}</Card.Title>
                    <Card.Text>
                      <strong>Product ID:</strong> {bid.productId}
                    </Card.Text>
                    <Card.Text>
                      <strong>Bid Amount:</strong> &#8377;{bid.bidAmount}
                    </Card.Text>
                    <Card.Text>
                      <strong>Bid Placed At:</strong> {new Date(bid.timestamp).toLocaleString()}
                    </Card.Text>
                    <Card.Text>
                      <strong>User ID:</strong> {bid.userId}
                    </Card.Text>
                    <Card.Text>
                      <strong>Winning Bid:</strong> {bid.isWinningBid ? 'Yes' : 'No'}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p>No bids found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserBidsPage;
