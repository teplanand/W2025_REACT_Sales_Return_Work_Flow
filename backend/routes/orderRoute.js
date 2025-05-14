import express from "express"
import {placeOrder,placeOrderRazorpay,allOrders,userOrders,updateStatus,RequestReturn,RequestDecision} from "../controllers/orderController.js"
import adminAuth from "../middleware/adminAuth.js"
import authUser from "../middleware/auth.js"

const orderRouter = express.Router()

// Admin features
orderRouter.get("/list",adminAuth,allOrders)
orderRouter.post("/status",adminAuth,updateStatus)

// Payment Features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)

// User Features

orderRouter.get('/userorders',authUser,userOrders)
orderRouter.post('/returnrequest',authUser,RequestReturn)
orderRouter.post('/return-decision',authUser,RequestDecision)



export default orderRouter;