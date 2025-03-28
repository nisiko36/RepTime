import { useState, useEffect } from "react";
import useOwnerMessages from "../hooks/useOwnerMessages";
import useAuth from "../hooks/useAuth";
import useShifts from "../hooks/useShifts";
import { formatShiftsForMessage } from "../utils/shiftFormatter";


const OwnerMessageEditor = () => {
    const { messages, loading, createOwnerMessage, updateOwnerMessage, deleteOwnerMessage } = useOwnerMessages();
    const { user } = useAuth();
    // インライン編集
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingText, setEditingText] = useState("");

    // シフトを取得
    const { shifts } = useShifts(); // 全シフト取得
    const [shiftText, setShiftText] = useState("");

    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    // 初期値で user.id を使用
    const [newMessage, setNewMessage] = useState({
        user_id: user?.id || "",
        messages: "",
        posted_on: today,// 当日を初期値
    });
    // posted_on（日付）に変化があったら、その日付のシフトだけ抽出して整形
    useEffect(() => {
        const formatDate = (d) => new Date(d).toISOString().split("T")[0];
        const targetDate = newMessage.posted_on;

        const filtered = shifts.filter((s) => {
            const inDate = s.check_in ? formatDate(s.check_in) : null;
            const outDate = s.check_out ? formatDate(s.check_out) : null;
            return inDate === targetDate || outDate === targetDate;
        });

        setShiftText(formatShiftsForMessage(filtered));
    }, [shifts, newMessage.posted_on]);


    const handleCreate = () => {
        if (!user) return;
        createOwnerMessage({ ...newMessage, user_id: user.id }); // 常に最新のuser_idで送信
        setNewMessage({
            user_id: user.id,
            messages: "",
            posted_on: today,
        });
    };



    if (loading) return <p>Loading...</p>;

    return (
        <div>
            {user?.role === "owner" && (
                <>
                    <h2 className="text-lg font-bold mt-6">新規メッセージ</h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                    <textarea
                        placeholder="メッセージ内容"
                        value={newMessage.messages}
                        onChange={(e) =>
                            setNewMessage({ ...newMessage, messages: e.target.value })
                        }
                        className="border p-2 w-full h-32 resize-y"
                    />
                        <input
                            type="date"
                            value={newMessage.posted_on}
                            onChange={(e) =>
                                setNewMessage({ ...newMessage, posted_on: e.target.value })
                            }
                            className="border p-2"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setNewMessage((prev) => ({
                                    ...prev,
                                    messages: prev.messages + "\n" + shiftText,
                                }))
                            }
                            className="bg-green-500 px-3 py-1 mr-2"
                        >
                            シフトを本文に挿入
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2"
                            onClick={handleCreate}
                        >
                            作成
                        </button>
                    </div>
                </>
            )}

            <ul className="mt-4">
                {messages.map((message) => (
                    <li key={message.id} className="p-2 border-b flex justify-between items-center">
                        <div className="flex-1">
                            {editingMessageId === message.id ? (
                                <textarea
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    className="border p-2 w-full h-28 resize-y"
                                />

                            ) : (
                                <>
                                    <p className="whitespace-pre-wrap">{message.messages}</p>
                                    <p className="text-sm text-gray-500">
                                        投稿日: {message.posted_on}
                                    </p>
                                </>
                            )}
                        </div>

                        {user?.role === "owner" && (
                            <div className="ml-4 flex gap-2">
                                {editingMessageId === message.id ? (
                                    <>
                                        <button
                                            className="bg-blue-500 text-white px-2 py-1"
                                            onClick={() => {
                                                updateOwnerMessage(message.id, {
                                                    messages: editingText,
                                                    posted_on: message.posted_on,
                                                    user_id: user.id,
                                                });
                                                setEditingMessageId(null);
                                                setEditingText("");
                                            }}
                                        >
                                            保存
                                        </button>
                                        <button
                                            className="bg-gray-400 text-white px-2 py-1"
                                            onClick={() => {
                                                setEditingMessageId(null);
                                                setEditingText("");
                                            }}
                                        >
                                            キャンセル
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="bg-green-500 text-white px-2 py-1"
                                            onClick={() => {
                                                setEditingMessageId(message.id);
                                                setEditingText(message.messages);
                                            }}
                                        >
                                            編集
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-2 py-1"
                                            onClick={() => deleteOwnerMessage(message.id)}
                                        >
                                            削除
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </li>
                ))}

            </ul>
        </div>
    );
};

export default OwnerMessageEditor;
