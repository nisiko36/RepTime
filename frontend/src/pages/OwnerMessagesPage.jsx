import { useState } from "react";
import useOwnerMessages from "../hooks/useOwnerMessages";
import useAuth from "../hooks/useAuth";

function OwnerMessagesPage() {
    const { messages, loading, createOwnerMessage, updateOwnerMessage, deleteOwnerMessage } = useOwnerMessages();

    // ログインユーザー情報を取得
    const { user } = useAuth(); // ログインユーザー情報を取得

    const [newMessage, setNewMessage] = useState({ user_id: "5", messages: "", pinned: false });

    const handleCreate = () => {
        createOwnerMessage(newMessage);
        setNewMessage({ user_id: "5", messages: "", pinned: false });
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">オーナーメッセージ</h1>

            {loading ? <p>Loading...</p> : (
                <ul className="mt-4">
                {messages.map((message) => (
                    <li key={message.id} className="p-2 border-b flex justify-between">
                    {message.messages} - {message.pinned ? "固定" : "通常"}
                    {user?.role === "owner" && ( // オーナーのみ編集・削除可能
                        <div>
                        <button className="bg-green-500 text-white px-2 py-1 mx-2" onClick={() => updateOwnerMessage(message.id, { messages: "更新されたメッセージ" })}>
                            更新
                        </button>
                        <button className="bg-red-500 text-white px-2 py-1" onClick={() => deleteOwnerMessage(message.id)}>
                            削除
                        </button>
                        </div>
                    )}
                    </li>
                ))}
                </ul>
            )}

            {user?.role === "owner" && ( // オーナーのみ作成可能
                <>
                <h2 className="text-lg font-bold mt-6">新規メッセージ</h2>
                <div className="mt-2 flex">
                    <input
                    type="text"
                    placeholder="メッセージ内容"
                    value={newMessage.messages}
                    onChange={(e) => setNewMessage({ ...newMessage, messages: e.target.value })}
                    className="border p-2 mx-2"
                    />
                    <select
                    value={newMessage.pinned}
                    onChange={(e) => setNewMessage({ ...newMessage, pinned: e.target.value === "true" })}
                    className="border p-2 mx-2"
                    >
                    <option value="false">通常</option>
                    <option value="true">固定</option>
                    </select>
                    <button className="bg-blue-500 text-white px-4 py-2" onClick={handleCreate}>
                    作成
                    </button>
                </div>
                </>
            )}
            </div>
        );
    }

    export default OwnerMessagesPage;
