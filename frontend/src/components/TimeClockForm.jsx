import { useState } from "react";
import { postTimeClock, saveAttendanceMemo } from "../api/freeeApi";
import ClockDisplay from "./ClockDisplay";
import useAuth from "../hooks/useAuth";


function TimeClockForm() {
    const { user } = useAuth();
    const [status, setStatus] = useState("");
    const [note, setNote] = useState("");


    const handleClockAction = async (clockType) => {
        if (!user) {
            alert("ログインユーザーが確認できません。");
            return;
        }

        const datetime = new Date().toLocaleString("sv-SE", { timeZone: "Asia/Tokyo" }).replace(" ", "T");
        const response = await postTimeClock(user.freee_employee_id, clockType, datetime, note);
        console.log(user.freee_employee_id)

        if (response?.error) {
            alert(`エラー: ${response.error}`);
        } else {
            alert("勤怠打刻が完了しました！");

            // freee人事労務とは関係のない顧客メモを保存
            if (note.trim() !== "") {
                await saveAttendanceMemo({
                    user_id: user.id,
                    date: datetime,
                    memo_type: clockType,
                    content: note
                });
            }
            // 押すとリセット
            setNote("");

            // ステータス変更
            switch (clockType) {
                case "clock_in":
                    setStatus("出勤中");
                    break;
                case "break_begin":
                    setStatus("休憩中");
                    break;
                case "break_end":
                    setStatus("勤務再開");
                    break;
                case "clock_out":
                    setStatus("退勤済");
                    break;
                default:
                    setStatus("");
            }
        }
    };

    return (
        <div className="p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">勤怠打刻</h2>

            {/* 現在時刻の表示 */}
            <ClockDisplay />

            {/* ユーザー名の表示 */}
            <div className="my-6 text-lg flex">
                <p className="font-semibold text-xl mb-1">
                    ユーザー：
                </p>
                <p className="text-2xl font-bold text">
                    {user?.name || "未取得"}
                </p>
                <p className="text-1xl font-bold text-blue-400 flex items-center gap-4">
                    {status && (
                        <span className="text- font-medium text-green-600">
                            （{status}）
                        </span>
                    )}
                </p>
            </div>

            {/* 打刻ボタン群 */}
            <div className="flex justify-center space-x-6 ">
                <button
                    onClick={() => handleClockAction("clock_in")}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    出勤
                </button>
                <button
                    onClick={() => handleClockAction("break_begin")}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    休憩開始
                </button>
                <button
                    onClick={() => handleClockAction("break_end")}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    休憩終了
                </button>
                <button
                    onClick={() => handleClockAction("clock_out")}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    退勤
                </button>
            </div>

            {/* 顧客メモが機能しない */}
            <div className="my-4">
                <label className="block font-medium mb-1">勤怠メモ（任意）:</label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="border p-2 w-full rounded"
                    placeholder="遅刻理由、業務内容など"
                />
            </div>
        </div>
    );
}

export default TimeClockForm;
