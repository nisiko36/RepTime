import React, { useState } from "react";
import CustomerMemos from "./CustomerMemos";

const CustomerModal = ({ customer, onClose, onUpdate }) => {
    const [editName, setEditName] = useState(customer.name || "");
    const [updating, setUpdating] = useState(false);

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            await onUpdate(customer.id, { name: editName });
            alert("顧客名を更新しました");
        } catch (error) {
            console.error("Error updating customer:", error);
            alert("更新に失敗しました");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">顧客詳細</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">名前</label>
                <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border border-gray-300 p-2 w-full rounded mt-1"
                />
                <button
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleUpdate}
                    disabled={updating}
                >
                    {updating ? "更新中..." : "名前を更新"}
                </button>
            </div>

            <div className="mb-4">
                <p><strong>訪問回数:</strong> {customer.visit_count}</p>
                <p><strong>Square ID:</strong> {customer.square_customer_id}</p>
                <p><strong>LINE ID:</strong> {customer.line_user_id}</p>
                <p><strong>LINE 名前:</strong> {customer.line_display_name}</p>
                <p><strong>最終来店:</strong> {customer.last_visit_at ? new Date(customer.last_visit_at).toLocaleString("ja-JP") : "未登録"}</p>
            </div>

            <CustomerMemos customerId={customer.id} />

            <div className="mt-6 flex justify-end">
                <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
                    閉じる
                </button>
            </div>
        </div>
        </div>
    );
};

export default CustomerModal;
