const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer'); // Add this line
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const app = express();
mongoose.set("strictQuery", true)
// Connect to MongoDB (replace this URI with your actual MongoDB URI)
mongoose.connect("mongodb+srv://hridaysehgal:hriday@cluster0.wv5erkl.mongodb.net/School", { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

const corsOptions = {//for localhost on local machine use http://localhost:3000
  origin: 'https://bidbotauctionsystem.onrender.com', // Replace with your React app's domain //use for deployed frontend
  credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));

// Example middleware to set no-cache headers
app.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', 0);
  next();
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kidsycartoons@gmail.com', // Your Gmail email address
    pass: 'saixgdpmmmdeyufv', // Use the generated app password here //this password is fake generated dont use for real purposes it wont work
  },
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true , limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));

app.post('/api/signup', async(req, res) => {
  const { username, email, password } = req.body;

  // Check if the email already exists in the database
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'Email already exists in the database' });
  }

// If the email doesn't exist, proceed to create a new user
  const newUser = new User({
    username,
    email,
    password
  });

  newUser.save((err, user) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json({ message: 'User successfully registered!', user });
  });
});

app.post('/api/login', async(req, res) => {
  const { email, password } = req.body;

  
  // Check if user with provided email exists in the database
  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (!user) {
      return res.status(401).json({ message: 'Email does not exist' });
    }

    // Now, verify the password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    return res.status(200).json({ message: 'Login successful' });
  });
});

app.post('/api/forgotPassword', async (req, res) => {
  const { email } = req.body;

  try{ 
  // Check if the email exists in the database
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'Email not found' });
  }

  // Generate a new password (you may want to use a library like `crypto` for more security)
  const newPassword = crypto.randomBytes(8).toString('hex'); // Implement this function

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password in the database
  user.password = newPassword;
  await user.save();

  // Send an email with the new password
  const mailOptions = {
    from: 'kidsycartoons@gmail.com', // Sender email address
    to: email,
    subject: 'Password Reset',
    text: `Dear user, we have received a forgot password request for your account. Your new password is: ${newPassword} Please do not share your password with anyone. We thank you for using our Online Auction System BidBot.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    console.log('Email sent:', info.response);
    return res.status(200).json({ message: 'Email sent successfully' });
  });
} catch (error) {
  console.error('Error:', error);
  return res.status(500).json({ message: 'Internal server error' });
}
});


//bidding schema
const bidSchema = new mongoose.Schema({
  name: String,
  description: String,
  startingBid: Number,
  currentBid: Number, // Add this field
  endTime: Date,
  userId: String, // Add this field to associate a product with a user
});

const Bid = mongoose.model('Bid', bidSchema);

app.use(bodyParser.json({ limit: '50mb' }));

app.post('/api/addBid', (req, res) => {
  const { name, description, startingBid, endTime,currentBid } = req.body;

  const newBid = new Bid({
    name,
    description,
    startingBid,
    currentBid, // Save the current bid
    endTime,
    userId: req.body.userId, // Include the userId
  });

  newBid.save((err, bid) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json({ message: 'Bid added successfully', bid });
  });
});

app.put('/api/modifyBid/:id', async (req, res) => {
  const bidId = req.params.id;
  const { newBid, currentBid } = req.body;

  try {
    // Fetch the bid
    const bid = await Bid.findById(bidId);

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Check if bidding has ended
    if (bid.endTime && new Date(bid.endTime) < new Date()) {
      return res.status(400).json({ message: 'Bidding for this product has already ended. Modification not allowed.' });
    }

    // Update startingBid and currentBid
    bid.startingBid = newBid;
    bid.currentBid = currentBid;

    // Save the updated bid
    const updatedBid = await bid.save();

    res.status(200).json({ message: 'Bid modified successfully', bid: updatedBid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/deleteBid/:id', async (req, res) => {
  try {
    const bidId = req.params.id;

    const deletedBid = await Bid.findByIdAndRemove(bidId);

    if (!deletedBid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    res.status(200).json({ message: 'Bid deleted successfully', bid: deletedBid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// user bid schema //
const userBidSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' },
  userId: String,
  bidAmount: Number,
  bidId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }, // Reference to the bid in the Bid collection
  productName: String, // Add the product name property
  isWinningBid: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const UserBid = mongoose.model('UserBid', userBidSchema);

app.post('/api/addUserBid', async(req, res) => {
  const { productId, userId, bidAmount } = req.body;

  try {
    // Fetch the product
    const product = await Bid.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

  const newUserBid = new UserBid({
    productId,
    userId,
    bidAmount,
    bidId: product._id,
    productName: product.name, // Save the product name
    timestamp: new Date(),
  });
  await newUserBid.save();

  res.status(200).json({ message: 'User bid added successfully', userBid });
  } catch (error) {
    console.error('Error adding user bid:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/getUserBids/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const userBids = await UserBid.find({ userId }).populate('bidId' , 'productId');
    res.status(200).json({ userBids });
  } catch (error) {
    console.error('Error fetching user bids:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//place bid 
app.post('/api/placeBid', async (req, res) => {
  const { productId, userId, bidAmount } = req.body;

  try {
    // Fetch the product
    const product = await Bid.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if bidAmount is greater than the currentBid
    if (bidAmount <= product.currentBid) {
      return res.status(400).json({ message: 'Bid amount must be greater than the current bid' });
    }


    // Identify the previous winning bid and mark it as not winning
    const previousWinningBid = await UserBid.findOne({ productId, isWinningBid: true });
    if (previousWinningBid) {
      previousWinningBid.isWinningBid = false;
      await previousWinningBid.save();
    }

    // Update the current bid for the product
    product.currentBid = bidAmount;

    await product.save();



  // Add user bid
  const addUserBid = async () => {
  const newUserBid = new UserBid({
    productId,
    userId,
    bidAmount,
    productName: product.name,
    bidId: product._id,
    isWinningBid: true, // Mark the current bid as winning
    timestamp: new Date(), // Add this line to include the timestamp
  });

  await newUserBid.save();
    };
    // Save the updated product
    await product.save();
    await addUserBid();

    // Fetch winning user details
    const winningUser = await UserBid.findOne({ productId: product._id, isWinningBid: true });
    
    console.log('Place Bid Response:', { message: 'Bid placed successfully' });

     // Send email to the winning user
     const mailOptions = {
      from: 'kidsycartoons@gmail.com',
      to: winningUser.userId, // Use userId as the email address
      subject: 'Congratulations! You are currently the highest bidder',
      text: 
      `Dear user, We have received your bid for the product "${product.name}" with a bid amount of ${bidAmount} and you are currently winning the bid. Your bid is the highest amongst all users. We thank you for using our Online Auction System BidBot.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        // Handle the error and respond to the client
        return res.status(500).json({ message: 'Internal server error' });
      }

      console.log('Email sent:', info.response);
      // Respond to the client that the bid was placed successfully
      res.status(200).json({ message: 'Bid placed successfully' });
    });
  } catch (error) {
    console.error('Error placing bid:', error);
    // Handle the error and respond to the client
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new endpoint to get winning bid details for a specific product
app.get('/api/getWinningBid/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    // Find the winning bid for the specified product
    const winningBid = await UserBid.findOne({ productId, isWinningBid: true }).select('userId');

    // Check if a winning bid is found
    if (!winningBid) {
      return res.status(404).json({ message: 'Winning bid not found for the specified product' });
    }

    res.status(200).json({ winningBid });
  } catch (error) {
    console.error('Error fetching winning bid details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new endpoint to fetch bids
app.get('/api/getBids', async (req, res) => {
  try {
    const userId = req.query.userId; // Get the user ID from the query parameter
     // Fetch only the products associated with the logged-in user
     const bids = await Bid.find(); // Fetch only the bids associated with the logged-in user
    res.status(200).json({ bids });
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/getUserId', (req, res) => {
  // Get the user ID from your authentication system
  // For simplicity, you can return a dummy user ID here
  const userId = req.query.email;
  res.status(200).json({ userId });
});

// Add a new endpoint to fetch a specific product by ID
app.get('/api/getBids/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Bid.findById(productId);
    res.status(200).json({ bids: [product] });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add these endpoints to your server code

// Endpoint to get total number of bids placed by a user
app.get('/api/getTotalBids/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const totalBids = await UserBid.countDocuments({ userId });
    res.status(200).json({ totalBids });
  } catch (error) {
    console.error('Error fetching total bids:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to get total number of products listed by a user
app.get('/api/getTotalProducts/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const totalProducts = await Bid.countDocuments({ userId });
    res.status(200).json({ totalProducts });
  } catch (error) {
    console.error('Error fetching total products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to get the number of winning bids for a user
app.get('/api/getWinningBids/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const winningBids = await UserBid.countDocuments({ userId, isWinningBid: true });
    res.status(200).json({ winningBids });
  } catch (error) {
    console.error('Error fetching winning bids:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Add this endpoint to your server code
app.post('/api/sendWelcomeEmail', async (req, res) => {
  const { email } = req.body;

  // Send welcome email logic here
  const mailOptions = {
    from: 'kidsycartoons@gmail.com',
    to: email,
    subject: 'Welcome to BidBot - Online Auction System',
    text: `Dear user, Welcome to BidBot, the ultimate online auction system. Explore exciting features and start bidding on your favorite items. Thank you for choosing BidBot!`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending welcome email:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    console.log('Welcome email sent:', info.response);
    return res.status(200).json({ message: 'Welcome email sent successfully' });
  });
});


const port = process.env.PORT || 5500;
app.listen(port, () => {
  console.log("Server is started on port " + port);
});
