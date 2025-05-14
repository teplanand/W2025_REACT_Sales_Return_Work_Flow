import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

// Route for userLogin
const loginUser = async(req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({success:false,message:"Password and email are mandatory"})
        }

        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"User doesn't exist"});
        }

        const matched = await bcrypt.compare(password,user.password);

        if(matched){
            const token = createToken(user._id);
            res.status(200).json({success:true,token});
        }
        else{
            res.status(400).json({success:false,message:"Wrong password"})
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json({success:false,message:err.message})
    }
}

// Route for user registration
const registerUser = async(req,res) => {
    try{
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({success:false,message:"All fields are mandatory"})
        }
        //checking email to avoid duplicate users
        const exists = await userModel.findOne({email});
        if(exists){
            return res.status(400).json({success:false,message:"user already exists"});
        }

        // validating email format & strong password
        if(!validator.isEmail(email)){
            return res.status(400).json({success:false,message:"Please enter valid email"});
        }
        if(password.length<8){
            
            return res.status(400).json({success:false,message:"Please enter a strong password"});
        }

        // hashing user password
        const hashedPassword = await bcrypt.hash(password,10)

        // 1st method of adding product into mongodb 2nd method in productController
        const newUser = await userModel.create({name,email,password:hashedPassword});
        const token = createToken(newUser._id)
        res.status(200).json({success:true,token})
    }
    catch(err){
        console.log(err);
        res.status(400).json({success:false,message:err.message})
    }
}

// Route for Admin login
const adminLogin = async(req,res) => {
    try{
        const {email,password} = req.body
        if(!email || !password){
            return res.status(400).json({success:false,message:"All fields are mandatory"})
        }

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.status(200).json({success:true,token})
        }
        else {
            res.status(400).json({success:false,message:"Invaid credentials"})
        }
    }
    catch(error){
        console.log(error)
        res.status(400).json({success:false,message:error.message})
    }
}

export {loginUser, registerUser, adminLogin};