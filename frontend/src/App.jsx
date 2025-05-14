import React from "react";
import {Routes,Route} from "react-router-dom";
import Home from "./pages/Home";
import Collections from "./pages/Collections";
import Orders from "./pages/Orders"
import PlaceOrder from "./pages/PlaceOrder";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/verify.jsx";

const app = () => {
  return(
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />{/*it will be displayed in all pages because we mounted it top of the every routes*/}
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/collections" element={<Collections/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/product/:productId" element={<Product/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/place-order" element={<PlaceOrder/>}/>
        <Route path="/orders" element={<Orders/>}/>
        <Route path="/verify" element={<Verify/>}/>
      </Routes>
      <Footer/>{/*it will be displayed in all pages because we mounted it bottom of the every route*/}
    </div>
  )
}

export default app;