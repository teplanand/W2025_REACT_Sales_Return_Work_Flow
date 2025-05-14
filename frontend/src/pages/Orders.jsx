import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";
import ReturnModal from "../components/ReturnModal";

const Orders = () => {
    const { backendUrl, token, currency } = useContext(ShopContext);
    const [orderData, setOrderData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const loadOrderData = async () => {
        try {
            if (!token) {
                return null;
            }

            const response = await axios.get(backendUrl + "/api/order/userorders", {
                headers: { token },
            });

            if (response.status === 200) {
                let allOrdersItem = [];
                response.data.orders.map((order) => {
                    order.items.map((item) => {
                        item["status"] = order.status;
                        item["payment"] = order.payment;
                        item["paymentMethod"] = order.paymentMethod;
                        item["date"] = order.date;
                        item["orderId"] = order._id; // Store order ID
                        item["returnRequest"] = order.returnRequest || {}; 
                        allOrdersItem.push(item);
                    });
                });
                setOrderData(allOrdersItem.reverse()); // recent orders will be on top
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            }
            console.log(error);
            toast.error(error.message);
        }
    };

    const handleReturnRequest = async (orderId, reason) => {
        try {
            const response = await axios.post(
                backendUrl + "/api/order/returnrequest",
                {
                    orderId,
                    reason,
                },
                {
                    headers: { token },
                }
            );

            if (response.status === 200) {
                toast.success("Return request submitted successfully");
                loadOrderData(); // Reload orders after submitting the request
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            }
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        loadOrderData();
    }, [token]);

    const openReturnModal = (orderId) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    const closeReturnModal = () => {
        setIsModalOpen(false);
        setSelectedOrderId(null);
    };

    const isWithinReturnPeriod = (orderDate) => {
        const orderDateTime = new Date(orderDate).getTime();
        const currentTime = new Date().getTime();
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        return (currentTime - orderDateTime) <= sevenDaysInMs;
    };

    return (
        <div className="border-t pt-16">
            <div className="text-2xl flex justify-between">
                <Title text1={"MY"} text2={"ORDERS"} />
            </div>

            <div>
                {orderData.map((item, index) => (
                    <div
                        key={index}
                        className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                        <div className="flex items-start gap-6 text-sm">
                            <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
                            <div>
                                <p className="sm:text-base font-medium">{item.name}</p>
                                <div className="flex items-center gap-2 mt-2 text-base text-gray-700">
                                    <p>{currency}{item.price}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Power: {item.size}</p>
                                </div>
                                <p className="mt-2">Date: <span className="text-gray-400">{new Date(item.date).toLocaleString('en-US', {
                                    month: '2-digit',
                                    day: '2-digit',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                })}</span></p>
                                <p className="mt-2">Payment: {item.paymentMethod}</p>
                            </div>
                        </div>

                       <div className="md:w-1/2 flex justify-between">
                            <div className="flex items-center gap-2">
                                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                                <p className="text-sm md:text-base">{item.status}</p>
                            </div>

                            {item.status === "Delivered" ? (
                                item.returnRequest && item.returnRequest.reason ? (
                                    <p className={`text-sm md:text-base ${
                                        item.returnRequest.status === "Accepted" ? "text-green-600" : 
                                        item.returnRequest.status === "Declined" ? "text-red-600" : "text-yellow-600"
                                    }`}>
                                        Return Request {item.returnRequest.status}
                                    </p>
                                ) : isWithinReturnPeriod(item.date) ? (
                                    <button
                                        onClick={() => openReturnModal(item.orderId)}
                                        className="border px-4 py-2 text-sm font-medium rounded-sm"
                                    >
                                        Return
                                    </button>
                                ) : (
                                    <p className="text-sm text-gray-500">Return period expired</p>
                                )
                            ) : (
                                <button
                                    onClick={loadOrderData}
                                    className="border px-4 py-2 text-sm font-medium rounded-sm"
                                >
                                    Track Order
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <ReturnModal
                isOpen={isModalOpen}
                onClose={closeReturnModal}
                onSubmit={handleReturnRequest}
                orderId={selectedOrderId}
            />
        </div>
    );
};

export default Orders;
