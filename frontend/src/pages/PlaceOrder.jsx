import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import razorpayLogo from '../assets/razorpay_logo.png';



const PlaceOrder = () => {    
    const {navigate,backendUrl,token,cartItems,setCartItems,getCartAmount,delivery_fee,products} = useContext(ShopContext);
    const [method,setMethod] =useState('cod');
    const [formData,setFormData] =useState({
        firstName:"",
        lastName:"",
        email:"",
        street:"",
        city:"",
        state:"",
        zipcode:"",
        country:"",
        phone:""
    })

    const onChangeHandler = (event) => {
        const name =event.target.name
        const value =event.target.value
        // [name] square brackets are necessary since it is variable
        setFormData(data => ({...data,[name]:value}))
    }
    
    const generateBill = (orderData) => {
        // Create a bill template in HTML
        const billContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
                <h1 style="text-align: center; font-size: 24px; margin-bottom: 20px;">Order Bill</h1>
                <div style="margin-bottom: 20px;">
                    <h2 style="font-size: 18px; margin-bottom: 10px;">Customer Information</h2>
                    <p><strong>Name:</strong> ${orderData.address.firstName} ${orderData.address.lastName}</p>
                    <p><strong>Email:</strong> ${orderData.address.email}</p>
                    <p><strong>Address:</strong> ${orderData.address.street}, ${orderData.address.city}, ${orderData.address.state}, ${orderData.address.zipcode}, ${orderData.address.country}</p>
                    <p><strong>Phone:</strong> ${orderData.address.phone}</p>
                </div>
                <div style="margin-bottom: 20px;">
                    <h2 style="font-size: 18px; margin-bottom: 10px;">Order Details</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid #000; padding: 8px;">Product</th>
                                <th style="border: 1px solid #000; padding: 8px;">Size</th>
                                <th style="border: 1px solid #000; padding: 8px;">Quantity</th>
                                <th style="border: 1px solid #000; padding: 8px;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderData.items.map(item => `
                                <tr>
                                    <td style="border: 1px solid #000; padding: 8px;">${item.name}</td>
                                    <td style="border: 1px solid #000; padding: 8px;">${item.size}</td>
                                    <td style="border: 1px solid #000; padding: 8px;">${item.quantity}</td>
                                    <td style="border: 1px solid #000; padding: 8px;">₹${item.price}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div style="text-align: right;">
                    <p><strong>Total Amount:</strong> ₹${orderData.amount}</p>
                </div>
            </div>
        `;

        // Open the bill in a new window for printing or saving
        const billWindow = window.open("", "_blank");
        billWindow.document.write(`
            <html>
                <head>
                    <title>Order Bill</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                        h1, h2 { text-align: center; }
                    </style>
                </head>
                <body>
                    ${billContent}
                    <script>
                        // Automatically trigger print dialog
                        window.onload = function() {
                            window.print();
                        };
                    </script>
                </body>
            </html>
        `);
        billWindow.document.close();
    };

    const onSubmitHandler = async(event) => {
        event.preventDefault()
        try{
            let orderItems = []
            for(const items in cartItems){
                for(const item in cartItems[items]){
                    if(cartItems[items][item]>0){
                        const itemInfo = structuredClone(products.find(product => product._id === items))
                        if(itemInfo){
                            itemInfo.size=item
                            itemInfo.quantity=cartItems[items][item]
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }
            
            let orderData ={
                address: formData,
                items: orderItems,
                amount: getCartAmount()+delivery_fee
            }

            switch(method){
                // api calls for cod
                case "cod":
                    try{
                        const response = await axios.post(backendUrl+'/api/order/place',orderData,{headers:{token}})
                        if(response.status === 200){
                            setCartItems({})
                            generateBill(orderData);
                            navigate('/orders')
                            toast.success("order succesfully placed")
                        }
                    }
                    catch(error){
                        if(error.response){
                            toast.error(error.response.data.message)
                        }
                        console.log(error)
                        toast.error(error.message)
                    }
                    break;
                default:
                    break;
            }
        }
        catch(error){

        }
    }
    
    return(
        <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
            {/* Left side */}
            <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                <div className="text-xl sm:text-2xl my-3 flex justify-between">
                    <Title text1={"DELIVERY"} text2={"INFORMATION"}/>
                </div>

                <div className="flex gap-3">
                    <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="First Name"/>
                    <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Last Name"/>
                </div>
                <input required onChange={onChangeHandler} name="email" value={formData.email} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="email" placeholder="Email address"/>
                <input required onChange={onChangeHandler} name="street" value={formData.street} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Street"/>
                <div className="flex gap-3">
                    <input required onChange={onChangeHandler} name="city" value={formData.city} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="City"/>
                    <input required onChange={onChangeHandler} name="state" value={formData.state} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="State"/>
                </div>
                <div className="flex gap-3">
                    <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Zipcode"/>
                    <input required onChange={onChangeHandler} name="country" value={formData.country} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Country"/>
                </div>
                <input required onChange={onChangeHandler} name="phone" value={formData.phone} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Phone"/>
            </div>

            {/* Right Side */}
            <div className="mt-8">
                <div className="mt-8 min-w-80">
                    <CartTotal />
                </div>

                <div className="mt-12">
                    <div className="flex justify-between">
                        <Title text1={"PAYMENT"} text2={"METHOD"}/>
                    </div>
                    
                    {/* Payment method selection */}
                    <div className="flex gap-3 flex-col lg:flex-row">
                        <div onClick={()=>{setMethod('razorpay')}} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? "bg-green-400" : ""}`}></p>
                            <img className="h-5 mx-4" src={razorpayLogo} alt="Razorpay" />
                        </div>
                        <div onClick={()=>{setMethod('cod')}} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? "bg-green-400" : ""}`}></p>
                            <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
                        </div>
                    </div>

                    <div className="w-full text-end mt-8">
                        <button type="submit" className="bg-black text-white px-16 py-3 text-sm">PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder;