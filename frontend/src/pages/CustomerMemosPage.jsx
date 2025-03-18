import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useCustomerMemos from "../hooks/useCustomerMemos";
import useCustomer from "../hooks/useCustomer";



function CustomerMemosPage() {
    const { customerId } = useParams();
    const { customer, loading: customerLoading } = useCustomer(customerId); // 顧客名取得
    const { memos, loading, createCustomerMemo, updateCustomerMemo, deleteCustomerMemo } = useCustomerMemos(customerId);

    // customerIdの管理
    const [selectedCustomerId, setSelectedCustomerId] = useState(customerId);

    const [newMemo, setNewMemo] = useState({
        customer_id: selectedCustomerId,
        user_id: "5",
        content: "",
        is_shared: false
    });

    // customerId が変わったら newMemo に反映
    useEffect(() => {
        setSelectedCustomerId(customerId);
        setNewMemo((prevMemo) => ({
            ...prevMemo,
            customer_id: customerId, // 最新の customerId を適用
        }));
    }, [customerId]);

    const handleCreate = () => {
        createCustomerMemo(newMemo);
        setNewMemo({
            customer_id: selectedCustomerId,
            user_id: "5",
            content: "",
            is_shared: false });
    };

    return (
        <div className="p-4">
        <h1 className="text-xl font-bold">顧客メモ一覧</h1>
        <h1 className="text-xl font-bold">
            顧客: {customerLoading ? "読み込み中..." : customer?.name} のメモ一覧
        </h1>

        {loading ? <p>Loading...</p> : (
            <ul className="mt-4">
            {memos.map((memo) => (
                <li key={memo.id} className="p-2 border-b flex justify-between">
                {memo.content} - {memo.is_shared ? "共有" : "個人"}
                <div>
                    <button className="bg-green-500 text-white px-2 py-1 mx-2" onClick={() => updateCustomerMemo(memo.id, { content: "更新されたメモ" })}>更新</button>
                    <button className="bg-red-500 text-white px-2 py-1" onClick={() => deleteCustomerMemo(memo.id)}>削除</button>
                </div>
                </li>
            ))}
            </ul>
        )}

        <h2 className="text-lg font-bold mt-6">新規メモ</h2>
        <div className="mt-2 flex">
            <input
                type="text"
                placeholder="メモ内容"
                value={newMemo.content}
                onChange={(e) => setNewMemo({ ...newMemo, content: e.target.value })}
                className="border p-2 mx-2"
            />

            <select
                value={newMemo.is_shared}
                onChange={(e) => setNewMemo({ ...newMemo, is_shared: e.target.value === "true" })}
                className="border p-2 mx-2"
            >
                <option value="false">個人メモ</option>
                <option value="true">共有メモ</option>
            </select>

            <button className="bg-blue-500 text-white px-4 py-2" onClick={handleCreate}>作成</button>
        </div>
        </div>
    );
}

export default CustomerMemosPage;
