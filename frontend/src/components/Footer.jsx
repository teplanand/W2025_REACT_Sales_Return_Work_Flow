import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div>
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
                <div>
                    <img src={assets.logo} className="mb-5 w-32"/>
                    <p className="w-full md:w-2/3 text-gray-600">
                    Create a global presence in power transmission with innovative and high-quality products that enhance value and customer satisfaction.Shop now for the latest solutions as we adapt to change, embrace creativity, and prioritize sustainability to deliver the best for our customers.
                    </p>
                </div>

                <div>
                    <ul className="flex flex-col gap-1 text-gray-600">
                        <Link to = "/"><li>Home</li></Link>
                        <Link to = "/collections"><li>Collections</li></Link>
                        <Link to = "/about"><li>About us</li></Link>
                    </ul>
                </div>

                <div>
                    <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
                    <ul className="flex flex-col gap-1 text-gray-600">
                        <li>+91-8320961348</li>
                        <li>Akdhandhukiya2@gmail.com</li>
                    </ul>
                </div>
            </div>

            <div>
                <hr />
                <p className="py-5 text-sm text-center">Copyright 2025 . NextGear Industries Limited. All rights reserved.
                </p>
            </div>
        </div>
    )
}

export default Footer;