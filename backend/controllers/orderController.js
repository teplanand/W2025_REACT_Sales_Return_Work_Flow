import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// global variables
const currency = 'inr'
const deliveryCharge=10
 

// placing orders using cod
const placeOrder = async(req,res) => {
    try{
        // userId comes from auth.js you have to pass only items,amount,address
        const {userId,items,amount,address} = req.body;
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)//creating new order document
        await newOrder.save()//saving document in mongodb database
        
        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.status(200).json({success:true,message:"Order placed"})
    }
    catch(error){
        console.log(error)
        res.status(400).json({success:false,message:error.message})
    }
}

// placing orders using razorpay method
const placeOrderRazorpay = async(req,res) => {

}

// All orders data for admin panel
const allOrders = async(req,res) => {
    try{
        const orders = await orderModel.find({})
        res.json({success:true,orders})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// user orders data for Frontend
const userOrders = async(req,res) => {
    try{
        const {userId} = req.body
        const orders = await orderModel.find({userId})
        res.status(200).json({success:true,orders})
    }
    catch(error){
        console.log(error)
        res.status(400).json({success:false,message:error.message})
    }
}

// update order status from admin
const updateStatus = async(req,res) => {
    try{
        const {orderId,status} = req.body

        await orderModel.findByIdAndUpdate(orderId,{status})
        res.status(200).json({success:true,message:"status updated"})
    }
    catch(error){
        res.status(400).json({success:"false",message:error.message})
    }
}
const RequestReturn = async (req, res) => {
  const { orderId, reason } = req.body;
  const { token } = req.headers;

  if (!token || !orderId || !reason) {
    return res.status(400).send({ message: "Invalid data." });
  }

  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).send({ message: "Order not found." });
    }

    if (order.status !== "Delivered") {
      return res.status(400).send({ message: "Return can only be requested for delivered orders." });
    }

    // Save the return reason and status in the order data
    order.returnRequest = { reason, status: "Pending", date: Date.now() }; // Added status field
    await order.save();

    res.status(200).send({ message: "Return request submitted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error." });
  }
};

const RequestDecision = async (req, res) => {
  const { orderId, decision } = req.body;

  try {
    console.log("Received Request:", { orderId, decision });

    // Fix: Use orderModel instead of Order
    const order = await orderModel.findById(orderId);
    if (!order) {
      console.log("Order not found!");
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.returnRequest || order.returnRequest.status !== "Pending") {
      console.log("No pending return request to act on");
      return res.status(400).json({ message: "No pending return request to act on" });
    }

    // Update return request status
    order.returnRequest.status = decision;
    order.returnRequest.date = new Date(); // Save the action timestamp

    order.markModified("returnRequest"); // Ensure changes are saved
    await order.save();

    console.log(`Return request ${decision.toLowerCase()} successfully`);
    return res.status(200).json({ message: `Return request ${decision.toLowerCase()} successfully` });
  } catch (err) {
    console.error("Error in RequestDecision:", err.message);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};



export {placeOrder,placeOrderRazorpay,allOrders,userOrders,updateStatus,RequestReturn,RequestDecision }
