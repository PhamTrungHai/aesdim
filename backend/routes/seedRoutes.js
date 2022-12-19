import express from 'express';
import Product from '../models/productModels.js';
import data from '../data.js';
import User from '../models/userModels.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Product.deleteMany({});
  const createdProduct = await Product.insertMany(data.products);
  await User.deleteMany({});
  const createdUser = await User.insertMany(data.users);
  res.send({ createdProduct });
});

export default seedRouter;
