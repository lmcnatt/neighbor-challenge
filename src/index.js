require('dotenv').config();
const express = require('express');
const listingsRoutes = require('./routes/listingsRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Let\'s do this Neighbor Challenge!' });
});

app.use('/listings', listingsRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});