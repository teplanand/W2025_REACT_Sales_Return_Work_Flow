import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editPrice, setEditPrice] = useState(null); // Track the product being edited
  const [newPrice, setNewPrice] = useState(""); // Store the new price

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.status === 200) {
        setList(response.data.products);
      }
    } catch (error) {
      if (error.response?.status) {
        toast.error(error.response.data.message);
      } else {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.delete(backendUrl + "/api/product/remove/" + id, {
        headers: { token },
      });

      if (response.status === 200) {
        await fetchList();
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const updatePrice = async (id) => {
    try {
      const response = await axios.put(
        backendUrl + "/api/product/update-price/" + id,
        { price: newPrice },
        { headers: { token } }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        setEditPrice(null); // Reset the edit state
        setNewPrice(""); // Clear the input
        fetchList(); // Refresh the list with updated prices
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>

      <div className="flex flex-col gap-2">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* Product List */}
        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            <img className="w-12" src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {editPrice === item._id ? (
                // Editable Price Field
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="border p-1"
                    placeholder="Enter new price"
                  />
                  <button
                    onClick={() => updatePrice(item._id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Update
                  </button>
                </div>
              ) : (
                <span>
                  {currency}
                  {item.price}
                  <button
                    onClick={() => {
                      setEditPrice(item._id);
                      setNewPrice(item.price);
                    }}
                    className="ml-2 text-blue-500 cursor-pointer"
                  >
                    Edit
                  </button>
                </span>
              )}
            </p>
            <p
              onClick={() => removeProduct(item._id)}
              className="text-right md:text-center cursor-pointer text-lg"
            >
              X
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
