import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"

// Function for add product
const addProduct = async(req,res) => {
    try
    {
        const {name,description,price,category,subCategory,sizes,bestSeller} = req.body
        // if image file is present in the request then take the image file
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1,image2,image3,image4].filter((item)=> item!=undefined)
        
        let imagesUrl = await Promise.all(
            images.map(async(item)=>{
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestSeller: bestSeller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now() 
        }

        console.log(productData)
        // 2nd method of adding product into mongodb 1st method in userController
        const product = new productModel(productData)
        await product.save()
        res.status(200).json({success:true,message:"product succesfully added"})
    }
    catch(error)
    {
        console.log(error)
        res.status(400).json({success:false,message:error.message})
    }
}

// Function for list product 
const listProducts = async(req,res) => {
    try{
        const products = await productModel.find({});
        res.status(200).json({success:true,products})
    }
    catch(error){
        console.log(error)
        res.status(400).json({success:false,message:error.message})
    }
}

// Function for removing product
const removeProduct = async(req,res) => {
    try{
        await productModel.findByIdAndDelete(req.params.id)
        res.status(200).json({success:true,message:"product removed"})
    }
    catch{
        console.log(error)
        res.status(400).json({success:false,message:error.message})
    }
}

// Function for single product info
const singleProduct = async(req,res) => {
    try{
        const productId = req.params.id
        console.log(productId)
        const product = await productModel.findById(productId);
        res.status(200).json({success:true,product})
    }
    catch(error){
        console.log(error)
        res.status(400).json({success:false,message:error.message})
    }
}

const updatePrice = async (req, res) => {
  try {
    const productId = req.params.id;
    const { price } = req.body;

    if (!price || isNaN(price) || price <= 0) {
      return res.status(400).json({ success: false, message: "Invalid price value." });
    }

    const product = await productModel.findByIdAndUpdate(
      productId,
      { price: Number(price) },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.status(200).json({ success: true, message: "Price updated successfully", product });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};


export {addProduct,listProducts,removeProduct,singleProduct,updatePrice};