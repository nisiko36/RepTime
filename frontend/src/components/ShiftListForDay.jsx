import React from "react";
import useShifts from "../hooks/useShifts";

// 時間表示フォーマット関数
const extractTime = (isoString) => {
    return isoString?.split("T")[1]?.slice(0, 5) || "-";
};

const ShiftListForDay = ({ date }) => {
    const { shifts, loading } = useShifts();

    if (loading) return <p>読み込み中...</p>;

    const formatDate = (d) => new Date(d).toISOString().split("T")[0];
    const targetDate = formatDate(date);

    // 対象日付に一致するシフトを抽出
    const shiftsForDay = shifts.filter((shift) => {
        const checkInDate = shift.check_in ? formatDate(shift.check_in) : null;
        const checkOutDate = shift.check_out ? formatDate(shift.check_out) : null;
        return checkInDate === targetDate || checkOutDate === targetDate;
    });

    return (
        <div className="mt-6 bg-gray p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-2">本日の出勤者</h2>
            {shiftsForDay.length === 0 ? (
                <p className="text-gray-600">この日に出勤したスタッフはいません。</p>
            ) : (
                <table className="min-w-full border-collapse text-sm">
                    <thead>
                        <tr>
                            <th className="border px-3 py-2">名前</th>
                            <th className="border px-3 py-2">出勤</th>
                            <th className="border px-3 py-2">退勤</th>
                            <th className="border px-3 py-2">休憩</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shiftsForDay.map((shift) => (
                            <tr key={shift.id}>
                                <td className="border px-3 py-1">{shift.user?.name || `ID: ${shift.user_id}`}</td>
                                <td className="border px-3 py-1">{extractTime(shift.check_in)}</td>
                                <td className="border px-3 py-1">{extractTime(shift.check_out)}</td>
                                <td className="border px-3 py-1">
                                    {shift.break_begin && shift.break_end
                                        ? `${extractTime(shift.break_begin)} - ${extractTime(shift.break_end)}`
                                        : "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ShiftListForDay;
