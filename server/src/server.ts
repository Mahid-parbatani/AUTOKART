require('dotenv').config();
import express from 'express'; 
import mongoose from 'mongoose';
const cors = require('cors');
import { connectDB } from './config/dbConnection';
import { seedDemoData } from './config/seed';
const { checkBlacklists } = require('./middlewear/jwtAuth');

const app = express();
const PORT = process.env.PORT || 4000; 
connectDB();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("../client/build"));

// Apply blacklist checking to all routes
app.use(checkBlacklists);


app.use('/user', require('./routes/userRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/order', require('./routes/orderRoutes'));
app.use('/address', require('./routes/addressRoutes'));
app.use('/blackbook', require('./routes/blackbookRoutes'));
// app.use('/payment', require('./routes/paymentRoutes'));


mongoose.connection.once('open', async () => {
    console.log('Connected to MongoDB');
    await seedDemoData();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});


module.exports = app;