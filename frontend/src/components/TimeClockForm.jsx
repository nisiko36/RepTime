import { useState } from "react";
import { postTimeClock } from "../api/freeeApi";
import ClockDisplay from "./ClockDisplay";
import useAuth from "../hooks/useAuth";
import AttendanceMemoForm from "./AttendanceMemoForm"; 

function TimeClockForm() {
    const { user } = useAuth();
    const [status, setStatus] = useState("");

    const handleClockAction = async (clockType) => {
        if (!user) {
            alert("ログインユーザーが確認できません。");
            return;
        }

        const datetime = new Date()
            .toLocaleString("sv-SE", { timeZone: "Asia/Tokyo" })
            .replace(" ", "T");

        const response = await postTimeClock(user.freee_employee_id, clockType, datetime);

        if (response?.error) {
            alert(`エラー: ${response.error}`);
        } else {
            alert("勤怠打刻が完了しました！");

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

            <ClockDisplay />

            <div className="my-6 text-lg flex items-center gap-2">
                <p className="font-semibold text-xl">ユーザー：</p>
                <p className="text-2xl font-bold">{user?.name || "未取得"}</p>
                {status && (
                    <span className="text-sm font-medium text-green-600">
                        （{status}）
                    </span>
                )}
            </div>

            <div className="flex justify-center space-x-6">
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

            {/* 勤怠メモフォームの追加 */}
            {user && <AttendanceMemoForm user={user} />}
        </div>
    );
}

export default TimeClockForm;
