import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function MonthView({ date, onDateSelect, onSwitchToDay }) {
    const [monthData, setMonthData] = useState([]); // [{ day: 1, count: 10 }, ...]
    const daysInMonth = getDaysInMonth(date);

    useEffect(() => {
        fetchMonthReservations(date);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date]);

    const fetchMonthReservations = async () => {
        try {
            // 各日ごとに予約件数を取得
            const requests = daysInMonth.map((day) => {
                const formattedDate = formatDateForApi(day);
                return apiClient.get(`/reservations/by_date?date=${formattedDate}`);
            });
            const responses = await Promise.all(requests);
            const data = daysInMonth.map((day, index) => {
                const count = Array.isArray(responses[index].data)
                    ? responses[index].data.length
                    : 0;
                return { day: day.getDate(), count };
            });
            setMonthData(data);
        } catch (error) {
            console.error("Error fetching month reservations:", error);
        }
    };

    // ここでカレンダーの空セルも考慮してセルを作成
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const startOffset = firstDayOfMonth.getDay(); // 0:日曜, 1:月曜,...
    const totalCells = startOffset + daysInMonth.length;

    // ヘッダー：曜日表示
    const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

    return (
        <div className="month-view max-w-4xl mx-auto p-4">
            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-center font-bold">
                {weekDays.map((wd, idx) => (
                    <div key={idx} className="p-2 border">
                        {wd}
                    </div>
                ))}
            </div>
            {/* カレンダー本体 */}
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: totalCells }).map((_, index) => {
                    if (index < startOffset) {
                        // 前月の空白セル
                        return <div key={index} className="p-4 border bg-gray-100" />;
                    }
                    const day = daysInMonth[index - startOffset];
                    const dayOfMonth = day.getDate();
                    const cellData = monthData.find((md) => md.day === dayOfMonth);
                    const count = cellData ? cellData.count : 0;
                    const weekday = day.getDay();
                    // 月曜日は定休日
                    if (weekday === 1) {
                        return (
                            <div
                                key={index}
                                className="p-4 border text-center"
                                style={{ backgroundColor: "#d3d3d3", color: "#666" }}
                            >
                                {dayOfMonth}
                                {/* <div className="text-xs">定休日</div> */}
                            </div>
                        );
                    }
                    // 通常日は、予約件数に応じた3段階の色を設定
                    const bgColor = getColorForCount(count);
                    return (
                        <div
                            key={index}
                            className="p-4 border text-center cursor-pointer"
                            style={{ backgroundColor: bgColor }}
                            onClick={() => {
                                onDateSelect(day);
                                onSwitchToDay();
                            }}
                        >
                            {dayOfMonth}
                            <div className="text-sm">{count}件</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// 指定月の日付オブジェクト配列を生成
function getDaysInMonth(baseDate) {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let d = firstDay; d <= lastDay; d = new Date(d.getTime() + 86400000)) {
        days.push(new Date(d));
    }
    return days;
}

// API送信用の日付フォーマット "YYYY-MM-DD"
function formatDateForApi(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * 予約件数に応じた背景色の決定
 * 0件 → 白, 1～4件 → 緑, 5～9件 → オレンジ, 10件以上 → 赤
 */
function getColorForCount(count) {
    if (count === 0) return "#ffffff";
    if (count <= 4) return "#48bb78"; // 緑
    if (count <= 9) return "#ed8936"; // オレンジ
    return "#e53e3e"; // 赤
}

export default MonthView;
