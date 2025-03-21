import { useState, useEffect } from "react";
import { fetchEmployees, postTimeClock } from "../api/freeeApi";

function TimeClockForm() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [clockType, setClockType] = useState("clock_in");
    const [datetime, setDatetime] = useState("");

    useEffect(() => {
        // 従業員一覧を取得
        const getEmployees = async () => {
            const data = await fetchEmployees();
            if (data) setEmployees(data);
        };
        getEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEmployee || !datetime) {
            alert("従業員と日時を選択してください。");
            return;
        }

        const response = await postTimeClock(selectedEmployee, clockType, datetime);
        if (response?.error) {
            alert(`エラー: ${response.error}`);
        } else {
            alert("勤怠打刻が完了しました！");
        }
    };

    return (
        <div className="p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">勤怠打刻</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 従業員選択 */}
                <label className="block">
                    従業員:
                    <select
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        className="border p-2 w-full"
                    >
                        <option value="">選択してください</option>
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.display_name} ({employee.email})
                            </option>
                        ))}
                    </select>
                </label>

                {/* 打刻タイプ選択 */}
                <label className="block">
                    打刻タイプ:
                    <select
                        value={clockType}
                        onChange={(e) => setClockType(e.target.value)}
                        className="border p-2 w-full"
                    >
                        <option value="clock_in">出勤</option>
                        <option value="clock_out">退勤</option>
                        <option value="break_begin">休憩開始</option>
                        <option value="break_end">休憩終了</option>
                    </select>
                </label>

                {/* 日時入力 */}
                <label className="block">
                    日時:
                    <input
                        type="datetime-local"
                        value={datetime}
                        onChange={(e) => setDatetime(e.target.value)}
                        className="border p-2 w-full"
                    />
                </label>

                {/* 送信ボタン */}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    打刻する
                </button>
            </form>
        </div>
    );
}

export default TimeClockForm;
