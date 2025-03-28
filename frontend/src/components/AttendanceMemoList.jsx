import React from "react";
import useAttendanceMemos from "../hooks/useAttendanceMemos";

const AttendanceMemoList = () => {
    const { memos, loading, deleteMemo } = useAttendanceMemos();

    if (loading) return <p>読み込み中...</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">勤怠メモ一覧</h2>
            <ul className="space-y-2">
                {memos.map((memo) => (
                    <li
                        key={memo.id}
                        className="border rounded px-3 py-2 shadow-sm text-sm flex justify-between items-start"
                    >
                        {/* 左側：名前・時間・メモ */}
                        <div className="flex-1">
                            <p className="text-gray-400 text-xs mb-1">
                                {memo.user?.name || "不明"}・
                                {new Date(memo.created_at).toLocaleString("ja-JP", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                })}
                            </p>
                            <p className="text-sm whitespace-pre-wrap">{memo.content}</p>
                        </div>

                        {/* 右側：削除ボタン */}
                        <button
                            onClick={() => deleteMemo(memo.id)}
                            className="ml-4 mt-1 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                        >
                            削除
                        </button>
                    </li>
                ))}
            </ul>
        </div>    );
};

export default AttendanceMemoList;
