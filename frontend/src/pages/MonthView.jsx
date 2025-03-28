import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function MonthView({ date, onDateSelect, onSwitchToDay }) {
    const [monthData, setMonthData] = useState([]);
    const [repeatRates, setRepeatRates] = useState({
        overall: 0,
        group1: 0,
        group2: 0,
        overallCount: [0, 0],
        group1Count: [0, 0],
        group2Count: [0, 0]
    });
    const daysInMonth = getDaysInMonth(date);

    useEffect(() => {
        fetchMonthReservations(date);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date]);

    const fetchMonthReservations = async () => {
        try {
            const requests = daysInMonth.map((day) => {
                const formattedDate = formatDateForApi(day);
                return apiClient.get(`/reservations/by_date?date=${formattedDate}`);
            });
            const responses = await Promise.all(requests);

            const data = daysInMonth.map((day, index) => {
                const reservations = responses[index].data || [];
                const total = reservations.length;
                const repeats = reservations.filter(r => r.is_repeat).length;
                return {
                    day: day.getDate(),
                    count: total,
                    repeats: repeats
                };
            });
            setMonthData(data);

            let allReservations = [];
            responses.forEach((response) => {
                if (Array.isArray(response.data)) {
                    allReservations.push(...response.data);
                }
            });

            const totalReservations = allReservations.length;
            const totalRepeats = allReservations.filter(r => r.is_repeat).length;
            const overallRate = totalReservations > 0 ? (totalRepeats / totalReservations) * 100 : 0;

            const group1Reservations = allReservations.filter(r => {
                if (!r.start_at) return false;
                const d = new Date(r.start_at);
                const weekday = d.getDay();
                return weekday === 2 || weekday === 3 || weekday === 4; // 火水木
            });
            const group1Total = group1Reservations.length;
            const group1Repeats = group1Reservations.filter(r => r.is_repeat).length;
            const group1Rate = group1Total > 0 ? (group1Repeats / group1Total) * 100 : 0;

            const group2Reservations = allReservations.filter(r => {
                if (!r.start_at) return false;
                const d = new Date(r.start_at);
                const weekday = d.getDay();
                return weekday === 5 || weekday === 6 || weekday === 0; // 金土日
            });
            const group2Total = group2Reservations.length;
            const group2Repeats = group2Reservations.filter(r => r.is_repeat).length;
            const group2Rate = group2Total > 0 ? (group2Repeats / group2Total) * 100 : 0;

            setRepeatRates({
                overall: overallRate,
                group1: group1Rate,
                group2: group2Rate,
                overallCount: [totalRepeats, totalReservations],
                group1Count: [group1Repeats, group1Total],
                group2Count: [group2Repeats, group2Total]
            });
        } catch (error) {
            console.error("Error fetching month reservations:", error);
        }
    };

    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const startOffset = firstDayOfMonth.getDay();
    const totalCells = startOffset + daysInMonth.length;
    const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

    return (
        <div className="month-view max-w-4xl mx-auto p-4">
            <div className="mb-4 space-y-2">
                <div className="p-2 text-center" style={{ backgroundColor: getColorForRepeatRate(repeatRates.overall) }}>
                    全体のリピート率: {repeatRates.overallCount[0]} / {repeatRates.overallCount[1]}（{repeatRates.overall.toFixed(1)}%）
                </div>
                <div className="p-2 text-center" style={{ backgroundColor: getColorForRepeatRate(repeatRates.group1) }}>
                    火水木のリピート率: {repeatRates.group1Count[0]} / {repeatRates.group1Count[1]}（{repeatRates.group1.toFixed(1)}%）
                </div>
                <div className="p-2 text-center" style={{ backgroundColor: getColorForRepeatRate(repeatRates.group2) }}>
                    金土日のリピート率: {repeatRates.group2Count[0]} / {repeatRates.group2Count[1]}（{repeatRates.group2.toFixed(1)}%）
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2 text-center font-bold">
                {weekDays.map((wd, idx) => (
                    <div key={idx} className="p-2 border">
                        {wd}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: totalCells }).map((_, index) => {
                    if (index < startOffset) {
                        return <div key={index} className="p-4 border bg-gray-100" />;
                    }
                    const day = daysInMonth[index - startOffset];
                    const dayOfMonth = day.getDate();
                    const cellData = monthData.find((md) => md.day === dayOfMonth);
                    const count = cellData ? cellData.count : 0;
                    const repeats = cellData ? cellData.repeats : 0;
                    const rate = count > 0 ? (repeats / count) * 100 : 0;
                    const weekday = day.getDay();

                    if (weekday === 1) {
                        return (
                            <div
                                key={index}
                                className="p-4 border text-center"
                                style={{ backgroundColor: "#d3d3d3", color: "#666" }}
                            >
                                {dayOfMonth}
                            </div>
                        );
                    }

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
                            <div className="text-sm">
                                {repeats} / {count}（{rate.toFixed(0)}%）
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

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

function formatDateForApi(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getColorForCount(count) {
    if (count === 0) return "#ffffff";
    if (count <= 4) return "#48bb78";
    if (count <= 9) return "#ed8936";
    return "#e53e3e";
}

function getColorForRepeatRate(rate) {
    if (rate < 50) return "#ed8936";
    if (rate <= 70) return "#48bb78";
    return "#e53e3e";
}

export default MonthView;
