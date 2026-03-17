
const mongoose = require('mongoose');
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express()
const port = 3001
const inventoryRoute = require('./routes/Inventory')
const salesRoute = require('./routes/Sales')
// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/book-keeper';
mongoose.connect(mongoURI, {
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));
  // bodyParser should be above methodOverride
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); //
  next();
});

app.use('/inventory', inventoryRoute);
app.use('/items', salesRoute);

app.listen(port, () => {
  console.log(`Book Keeper app listening on port ${port}`)
})