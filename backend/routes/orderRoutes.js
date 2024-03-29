import express from 'express';
import User from '../models/userModels.js';
import Product from '../models/productModels.js';
import { isAuth, isAdmin } from '../util.js';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModels.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const orderRouter = express.Router();

orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name');
    res.send(orders);
  })
);

orderRouter.put(
  '/:id/deliver',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const result = await order.save();
      res.send({ message: 'Order Delivered' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

function generate() {
  return new Promise((resolve) => {
    let length = 4;
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    resolve(result);
  });
}

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    const order = await newOrder.save();
    const a = await generate();
    let current = new Date();
    let cDate =
      current.getFullYear() +
      '-' +
      (current.getMonth() + 1) +
      '-' +
      current.getDate();
    let cTime =
      current.getHours() +
      ':' +
      current.getMinutes() +
      ':' +
      current.getSeconds();
    let dateTime = cDate + ' ' + cTime;
    const NGAYDAT = new Date(dateTime);
    const donhangs = await prisma.dONHANG.create({
      data: {
        MADH: a,
        MAKH: req.body.shippingAddress.fullname,
        SoLuongSP: order.orderItems.length,
        TTien: req.body.totalPrice,
        NGAYDAT: NGAYDAT,
        TRANGTHAI: 1,
        TTTHANHTOAN: 1,
      },
    });
    const arr = Array.from(
      req.body.orderItems.map((x) => {
        return {
          MADH: donhangs.MADH,
          MASP: x.slug,
          SOLUONG: x.quantity,
        };
      })
    );
    console.log(arr);
    await prisma.cTDONHANG.createMany({
      data: arr,
    });
    const b = await generate();
    await prisma.hOADON.create({
      data: {
        MAHD: b,
        TONGTIEN: req.body.totalPrice,
      },
    });
    const arr1 = Array.from(
      req.body.orderItems.map((x) => {
        return {
          NGAY: NGAYDAT,
          SOLUONGDH: 1,
          TTIENDH: req.body.totalPrice,
          MAHD: b,
          MADH: a,
        };
      })
    );
    console.log(arr1);
    await prisma.cTHOADON.createMany({
      data: arr1,
    });
    res.status(201).send({ message: 'New order created', order });
  })
);

orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: 'Order Deleted' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);
export default orderRouter;
