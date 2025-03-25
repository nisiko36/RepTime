import React, { useState, useEffect } from "react";
import useCustomerMemos from "../hooks/useCustomerMemos";
import useAuth from "../hooks/useAuth";

const MemoItem = ({ memo, updateCustomerMemo, deleteCustomerMemo }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(memo.content);

    useEffect(() => {
        setEditedContent(memo.content);
    }, [memo.content]);

    const handleSave = () => {
        updateCustomerMemo(memo.id, { content: editedContent });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedContent(memo.content);
        setIsEditing(false);
    };

    return (
        <li className="p-2 border-b flex justify-between items-center">
            {isEditing ? (
                <input
                    type="text"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="border p-1 flex-grow mr-2"
                />
            ) : (
                <span className="flex-grow">
                    {memo.content} - {memo.is_shared ? "共有" : "個人"}
                </span>
            )}
            <div>
                {isEditing ? (
                    <>
                        <button
                            className="bg-blue-500 text-white px-2 py-1 mx-2"
                            onClick={handleSave}
                        >
                            保存
                        </button>
                        <button
                            className="bg-gray-500 text-white px-2 py-1 mx-2"
                            onClick={handleCancel}
                        >
                            キャンセル
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="bg-green-500 text-white px-2 py-1 mx-2"
                            onClick={() => setIsEditing(true)}
                        >
                            編集
                        </button>
                        <button
                            className="bg-red-500 text-white px-2 py-1"
                            onClick={() => deleteCustomerMemo(memo.id)}
                        >
                            削除
                        </button>
                    </>
                )}
            </div>
        </li>
    );
};

const CustomerMemos = ({ customerId, customerName }) => {
    const { memos, loading, createCustomerMemo, updateCustomerMemo, deleteCustomerMemo } = useCustomerMemos(customerId);
    const { user } = useAuth();

    const [newMemo, setNewMemo] = useState({
        customer_id: customerId,
        user_id: user ? user.id : "",
        content: "",
        is_shared: false,
    });

    useEffect(() => {
        setNewMemo((prevMemo) => ({
            ...prevMemo,
            customer_id: customerId,
            user_id: user ? user.id : prevMemo.user_id,
        }));
    }, [customerId, user]);

    const handleCreate = () => {
        createCustomerMemo(newMemo);
        setNewMemo({
            customer_id: customerId,
            user_id: user ? user.id : "",
            content: "",
            is_shared: false,
        });
    };

    return (
        <div className="p-4 border rounded">
            <h2 className="text-lg font-bold mb-2">
                顧客: {customerName || "顧客"} のメモ一覧
            </h2>

            {loading ? (
                <p>読み込み中...</p>
            ) : (
                <ul className="mt-4">
                    {memos.map((memo) => (
                        <MemoItem
                            key={memo.id}
                            memo={memo}
                            updateCustomerMemo={updateCustomerMemo}
                            deleteCustomerMemo={deleteCustomerMemo}
                        />
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
                <button className="bg-blue-500 text-white px-4 py-2" onClick={handleCreate}>
                    作成
                </button>
            </div>
        </div>
    );
};

export default CustomerMemos;
