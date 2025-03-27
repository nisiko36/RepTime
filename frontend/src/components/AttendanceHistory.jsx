import useShifts from "../hooks/useShifts";
import useAuth from "../hooks/useAuth";

function AttendanceHistory() {
    const { shifts, loading } = useShifts();
    const { user } = useAuth();

    if (loading) {
        return <div>読み込み中...</div>;
    }

    // ログインユーザーのシフトのみ抽出
    const userShifts = shifts.filter((shift) => shift.user_id === user?.id);

    // ISO文字列から "HH:MM" を抽出する関数
    const extractTime = (isoString) => {
        return isoString?.split("T")[1]?.slice(0, 5) || "-";
    };

    return (
        <div className="p-4 border rounded shadow mt-4">
            <h2 className="text-xl font-bold mb-4">あなたのシフト</h2>
            <table className="min-w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">日付</th>
                        <th className="border px-4 py-2">出勤</th>
                        <th className="border px-4 py-2">退勤</th>
                        <th className="border px-4 py-2">休憩</th>
                    </tr>
                </thead>
                <tbody>
                    {userShifts.map((shift) => (
                        <tr key={shift.id}>
                            <td className="border px-4 py-2">
                                {shift.check_in?.split("T")[0]}
                            </td>
                            <td className="border px-4 py-2">
                                {extractTime(shift.check_in)}
                            </td>
                            <td className="border px-4 py-2">
                                {extractTime(shift.check_out)}
                            </td>
                            <td className="border px-4 py-2">
                                {shift.break_begin && shift.break_end
                                    ? `${extractTime(shift.break_begin)} - ${extractTime(shift.break_end)}`
                                    : "-"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AttendanceHistory;
