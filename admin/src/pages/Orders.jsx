import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      if (!token) return null;

      const response = await axios.get(backendUrl + "/api/order/list", {
        headers: { token },
      });

      if (response.status === 200) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );

      if (response.status === 200) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleReturnDecision = async (orderId, decision) => {
  try {
    const response = await axios.post(
      backendUrl + "/api/order/return-decision",
      { orderId, decision },
      { headers: { token } }
    );

    if (response.status === 200) {
      toast.success(response.data.message);

      // Update order list without re-fetching everything
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, returnRequest: { ...order.returnRequest, status: decision === "Approved" ? "Accepted" : "Declined" } }
            : order
        )
      );
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};


  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Order Page</h3>
      <div>
        {orders.map((order, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
            key={index}
          >
            <img className="w-12" src={assets.parcel_icon} alt="parcel" />

            <div>
              <div>
                {order.items.map((item, itemIndex) => (
                  <p className="py-0.5" key={itemIndex}>
                    {item.name} x {item.quantity} <span>{item.size}</span>
                    {itemIndex !== order.items.length - 1 && ","}
                  </p>
                ))}
              </div>
              <p className="mt-3 mb-2 font-medium">
                {order.address.firstName + " " + order.address.lastName}
              </p>

              <div>
                <p>{order.address.street},</p>
                <p>
                  {order.address.city}, {order.address.state},{" "}
                  {order.address.country}, {order.address.zipcode}
                </p>
              </div>
              <p>{order.address.phone}</p>
            </div>

            <div>
              <p className="text-sm sm:text-[15px]">
                Items: {order.items.length}
              </p>
              <p className="mt-3">Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? "Done" : "Pending"}</p>
              <p>Date: {new Date(order.date).toLocaleString()}</p>
            </div>

            <p className="text-sm sm:text-[15px]">
              {currency}
              {order.amount}
            </p>

            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="p-2 font-semibold"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>

            {/* Return Request Section */}
            {order.returnRequest && order.returnRequest.reason && (
                <div className="col-span-full mt-4 p-3 rounded-md border bg-gray-50">
                  <p className="font-semibold text-sm mb-2 text-gray-800">
                    Return Status:{" "}
                    <span
                      className={
                        order.returnRequest.status === "Pending"
                          ? "text-yellow-600"
                          : order.returnRequest.status === "Approved"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {order.returnRequest.status}
                    </span>
                  </p>
                  {order.returnRequest.reason && (
                    <p>
                      <strong>Reason:</strong> {order.returnRequest.reason}
                    </p>
                  )}
                  {order.returnRequest.description && (
                    <p>
                      <strong>Description:</strong> {order.returnRequest.description}
                    </p>
                  )}

                  {order.returnRequest.status === "Pending" ? (
  <div className="flex gap-3 mt-3">
    <button
      onClick={() => handleReturnDecision(order._id, "Approved")}
      className="px-4 py-1 bg-green-500 text-white rounded"
    >
      Approve
    </button>
    <button
      onClick={() => handleReturnDecision(order._id, "Declined")}
      className="px-4 py-1 bg-red-500 text-white rounded"
    >
      Decline
    </button>
  </div>
) : (
  <p className={`text-sm font-semibold ${
    order.returnRequest.status === "Accepted" ? "text-green-600" : "text-red-600"
  }`}>
    Return Request {order.returnRequest.status}
  </p>
)}

                </div>
              )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
