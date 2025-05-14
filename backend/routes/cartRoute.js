import express from "express";
import { addToCart,getUserCart,updateCart } from "../controllers/cartController.js";
import authUser from "../middleware/auth.js";

const cartRouter = express.Router()

// authUser acts as a middleware for authorization provides id to req.body if user is authorized
cartRouter.post("/get",authUser,getUserCart)
cartRouter.post("/add",authUser,addToCart)
cartRouter.post("/update",authUser,updateCart)

export default cartRouter