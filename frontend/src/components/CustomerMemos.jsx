import { useState, useEffect } from "react";
import useCustomerMemos from "../hooks/useCustomerMemos";
import useCustomer from "../hooks/useCustomer";

function CustomerMemos({ customerId }) {
    const { customer, loading: customerLoading } = useCustomer(customerId);
    const {
        memos,
        loading,
        createCustomerMemo,
        updateCustomerMemo,
        deleteCustomerMemo,
    } = useCustomerMemos(customerId);

    const [newMemo, setNewMemo] = useState({
        customer_id: customerId,
        user_id: "5",
        content: "",
        is_shared: false,
    });

    useEffect(() => {
        setNewMemo((prevMemo) => ({
        ...prevMemo,
        customer_id: customerId,
        }));
    }, [customerId]);

    const handleCreate = () => {
        createCustomerMemo(newMemo);
        setNewMemo({
        customer_id: customerId,
        user_id: "5",
        content: "",
        is_shared: false,
        });
    };

    return (
        <div className="p-4 border rounded">
        <h2 className="text-lg font-bold mb-2">
            顧客: {customerLoading ? "読み込み中..." : customer?.name} のメモ一覧
        </h2>

        {loading ? (
            <p>読み込み中...</p>
        ) : (
            <ul className="mt-4">
            {memos.map((memo) => (
                <li
                key={memo.id}
                className="p-2 border-b flex justify-between items-center"
                >
                <span>
                    {memo.content} - {memo.is_shared ? "共有" : "個人"}
                </span>
                <div>
                    <button
                    className="bg-green-500 text-white px-2 py-1 mx-2"
                    onClick={() =>
                        updateCustomerMemo(memo.id, { content: "更新されたメモ" })
                    }
                    >
                    更新
                    </button>
                    <button
                    className="bg-red-500 text-white px-2 py-1"
                    onClick={() => deleteCustomerMemo(memo.id)}
                    >
                    削除
                    </button>
                </div>
                </li>
            ))}
            </ul>
        )}

        <div className="mt-6">
            <h3 className="font-bold">新規メモ</h3>
            <div className="mt-2 flex items-center">
            <input
                type="text"
                placeholder="メモ内容"
                value={newMemo.content}
                onChange={(e) =>
                setNewMemo({ ...newMemo, content: e.target.value })
                }
                className="border p-2 mx-2"
            />
            <select
                value={newMemo.is_shared}
                onChange={(e) =>
                setNewMemo({ ...newMemo, is_shared: e.target.value === "true" })
                }
                className="border p-2 mx-2"
            >
                <option value="false">個人メモ</option>
                <option value="true">共有メモ</option>
            </select>
            <button
                className="bg-blue-500 text-white px-4 py-2"
                onClick={handleCreate}
            >
                作成
            </button>
            </div>
        </div>
        </div>
    );
}

export default CustomerMemos;
