import React, { useState } from "react";
import { saveAttendanceMemo } from "../api/freeeApi";

const AttendanceMemoForm = ({ user }) => {
    const [note, setNote] = useState("");
    const [memoType, setMemoType] = useState("その他");
    const [status, setStatus] = useState("");

    const handleSubmit = async () => {
        if (!note.trim()) {
            alert("メモを入力してください");
            return;
        }

        const datetime = new Date().toISOString();
        await saveAttendanceMemo({
            user_id: user.id,
            date: datetime,
            memo_type: memoType,
            content: note,
        });

        setNote("");
        setStatus("メモを保存しました！");
    };

    return (
        <div className="p-4 mt-4">
            <h2 className="text-lg font-semibold mb-2">勤怠メモ（任意記録）</h2>

            <select
                className="border p-2 mb-2 rounded w-full"
                value={memoType}
                onChange={(e) => setMemoType(e.target.value)}
            >
                <option value="勤怠">勤怠記録</option>
                <option value="業務記録">業務記録</option>
            </select>

            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="border p-2 w-full rounded mb-2"
                placeholder="遅刻理由、業務内容など"
            />

            <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                メモを登録
            </button>

            {status && <p className="text-green-600 mt-2">{status}</p>}
        </div>
    );
};

export default AttendanceMemoForm;
