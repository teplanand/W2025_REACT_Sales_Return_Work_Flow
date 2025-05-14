// ReturnModal.js
import React, { useState } from "react";

const ReturnModal = ({ isOpen, onClose, onSubmit, orderId }) => {
    const [selectedReason, setSelectedReason] = useState("");

    const handleSubmit = () => {
        if (selectedReason) {
            onSubmit(orderId, selectedReason);
            onClose();
        } else {
            alert("Please select a reason.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-lg font-bold mb-4">Return Request</h2>
                <label htmlFor="reason" className="block text-sm mb-2">Select Return Reason</label>
                <select
                    id="reason"
                    className="w-full p-2 border rounded-md"
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                >
                   <option value="">Select Reason</option>
                    <option value="Damaged Item">Damaged Item</option>
                    <option value="Wrong Item Received">Wrong Item Received</option>
                    <option value="Item Not as Described">Item Not as Described</option>
                    <option value="Size Issue">Size Issue</option>
                    <option value="Quality Issue">Quality Issue</option>
                    <option value="Late Delivery">Late Delivery</option>
                    <option value="Duplicate Order">Duplicate Order</option>
                    <option value="No Longer Needed">No Longer Needed</option>
                    <option value="Incorrect Billing">Incorrect Billing</option>
                    <option value="Defective Product">Defective Product</option>
                    <option value="Other">Other</option>
                </select>
                <div className="mt-4 flex justify-end">
                    <button className="mr-2 p-2 border rounded-md text-gray-500" onClick={onClose}>Cancel</button>
                    <button className="p-2 border rounded-md bg-blue-500 text-white" onClick={handleSubmit}>Submit Return</button>
                </div>
            </div>
        </div>
    );
};

export default ReturnModal;
