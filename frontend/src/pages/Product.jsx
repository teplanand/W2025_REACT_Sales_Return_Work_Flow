import React, { useContext, useEffect,useState } from "react";
import { useParams,useNavigate } from "react-router-dom"
import { ShopContext } from "../context/ShopContext.jsx"
import { assets } from "../assets/assets.js";
import RelatedProducts from "../components/RelatedProducts.jsx";
import axios from "axios";

const Product = () => {
    const navigate = useNavigate();
    const {productId} = useParams();
    const {products,currency,addToCart} = useContext(ShopContext);
    const [productData,setProductData] = useState(false);
    const [image,setImage] = useState("");
    const [size,setSize] = useState('');

    const fetchProductData = async () => {
        products.map((item) => {
            if(item._id === productId){
                setProductData(item);
                setImage(item.image[0]);
                return null;
            }
        })
    }

    useEffect(() => {
        fetchProductData()
    },[productId])

    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
            return;
        }

        if (!size) {
            alert("Please select a size");
            return;
        }

        try {
            await addToCart(productData._id, size);
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token'); 
                navigate('/login'); 
            } else {
                alert("Failed to add to cart. Please try again.");
            }
        }
    };

    return productData ? (
        <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
            {/* Product Data */}
            <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
                
                {/* Product Images */}
                <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
                    {/* Small images */}
                    <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto justify-between sm:justify-normal sm:w-[18.7%] w-full">
                        {
                            productData.image.map((item,index) => (
                                <img onClick={() => setImage(item)} src={item} key={index} className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer" alt="" />
                            ))
                        }
                    </div>

                    <div className="w-full sm:w-[80%]">
                        <img className="w-full h-auto" src={image} alt="" />
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex-1">
                    <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
                    <div className="flex items-center gap-1 mt-2">
                        <img src={assets.star_icon} alt="" className="w-3.5" />
                        <img src={assets.star_icon} alt="" className="w-3.5" />
                        <img src={assets.star_icon} alt="" className="w-3.5" />
                        <img src={assets.star_icon} alt="" className="w-3.5" />
                        <img src={assets.star_dull_icon} alt="" className="w-3.5" />
                        <p className="pl-2">(122)</p>
                    </div>
                    <p className="font-medium text-3xl mt-5">{currency}{productData.price}</p>
                    <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
                
                    <div className="flex flex-col gap-4 my-8">
                        <p>Select HP</p>
                        <div className="flex gap-2">
                            {
                                productData.sizes.map((item,index) => 
                                    (<button onClick={() => setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item == size ? 'border-orange-500' : ''}`} key={index}>{item}</button>))
                            }
                        </div>
                    </div>

                    <button onClick={handleAddToCart} className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700">ADD TO CART</button>
                    <hr className="mt-8 sm:w-4/5"/>
                    <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
                            <p>100% Original product</p>
                            <p>Cash on delivery is available on this product</p>
                            <p>Easy return and exchange policy in 7 days</p>
                    </div>
                </div>
            </div>

            <div className="mt-20">
                <div className="flex">
                    <b className="border px-5 py-3 text-sm">Description</b>
                    <p className="border px-5 py-3 text-sm">Reviews (122)</p>
                </div>

                <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
                    <p>A gearbox website is an online platform that facilitates the buying and selling of industrial gear solutions. It serves as a virtual marketplace where businesses can showcase their products, interact with customers, and conduct transactions without the need for a physical presence. Gearbox websites have gained immense popularity due to their convenience, accessibility, and the global reach they offer.</p>
                    <p>Gearbox websites typically showcase products with detailed specifications, images, pricing, and available variations (e.g., power ratings, sizes, configurations). Each gearbox has its own dedicated page with relevant technical information to help customers make informed decisions.</p>
                </div>
            </div>

            {/* Display related products */}
            <RelatedProducts category={productData.category} subCategory={productData.subCategory}/>
        </div>
    ) : <div className="opacity-0"></div>
}

export default Product;