import React, { useState } from "react";
import SeatTimelineModal from "../components/SeatTimelineModal";

const START_HOUR = 18;
const END_HOUR = 23;
const TOTAL_HOURS = END_HOUR - START_HOUR; // 5時間

function SeatTimeline({ seatName, reservations, date, updateReservation }) {
    const [selectedReservation, setSelectedReservation] = useState(null);

    const handleCloseModal = () => {
        setSelectedReservation(null);
    };

    return (
        <div className="relative mb-1" style={{ height: "30px" }}>
            {/* 左側に席番号を表示 */}
            <div className="absolute left-0 top-0 h-full flex items-center pl-2 font-bold text-sm">
                {seatName}
            </div>
            {/* タイムラインエリア */}
            <div className="relative ml-16 h-full bg-gray-200">
                {getTimeTicks(START_HOUR, END_HOUR, 0.5).map((tick, idx) => {
                    const leftPercent = calcPercent(tick, START_HOUR, TOTAL_HOURS);
                    return (
                        <div
                            key={idx}
                            className="absolute"
                            style={{ left: `${leftPercent}%`, top: 0 }}
                        >
                            {seatName === "A1" && (
                                <div className="text-white text-xs absolute -top-6">
                                    {formatTimeLabel(tick)}
                                </div>
                            )}
                            {seatName === "D2" && (
                                <div className="text-white text-xs absolute -bottom-6">
                                    {formatTimeLabel(tick)}
                                </div>
                            )}
                            <div className="relative" style={{ height: "30px" }}>
                                <div className="h-full border-l border-black border-dotted"></div>
                            </div>
                        </div>
                    );
                })}
                {/* 予約帯の表示 */}
                {reservations.map((res, idx) => {
                    const startPercent = calcTimePercent(res.start_at);
                    const endPercent = calcTimePercent(res.end_at);
                    const widthPercent = endPercent - startPercent;
                    const color = res.is_repeat ? "#4299e1" : "#48bb78";

                    return (
                        <div
                            key={idx}
                            className="absolute flex items-center justify-left cursor-pointer text-white text-xs rounded"
                            style={{
                                left: `${startPercent}%`,
                                width: `${widthPercent}%`,
                                height: "100%",
                                backgroundColor: color,
                                border: "1px solid black"
                            }}
                            onClick={() => setSelectedReservation(res)}
                        >
                            {/* 飛び込みならマーク表示 */}
                            {!res.is_walk_in && (
                                <span className="text-[10px] text-black bg-yellow-300 rounded px-1 mt-0.5">
                                    予約
                                </span>
                            )}

                            <span>{res.customer?.name || res.customer?.line_display_name}</span>



                        </div>
                    );
                })}
            </div>

            {/* モーダル表示 */}
            {selectedReservation && (
                <SeatTimelineModal
                    reservation={selectedReservation}
                    date={date}
                    onClose={handleCloseModal}
                    onUpdateReservation={(id, updatedData) => {
                        updateReservation(id, updatedData);
                        handleCloseModal();
                    }}
                />
            )}
        </div>
    );
}

/**
 * getTimeTicks: 30分刻みの配列を生成
 * 例: start=18, end=23, step=0.5 -> [18, 18.5, 19, …, 23]
 */
function getTimeTicks(start, end, step) {
    const ticks = [];
    for (let t = start; t <= end; t += step) {
        ticks.push(t);
    }
    return ticks;
}

/**
 * calcPercent: 指定された時刻 (例: 18.5) を START_HOUR～END_HOUR のパーセンテージに変換
 */
function calcPercent(timeVal, startVal, totalRange) {
    const offset = timeVal - startVal;
    return (offset / totalRange) * 100;
}

/**
 * calcTimePercent: 予約の開始／終了時刻 (UTC文字列) を、
 * 18:00～23:00 の範囲に対するパーセンテージに変換する
 */
function calcTimePercent(dateTimeStr) {
    const d = new Date(dateTimeStr);
    const localHours = d.getHours() + d.getMinutes() / 60;
    const clamped = Math.max(START_HOUR, Math.min(localHours, END_HOUR));
    return ((clamped - START_HOUR) / TOTAL_HOURS) * 100;
}

/**
 * formatTimeLabel: 数値の時刻 (例: 18.5) を "18:30" のような文字列に変換
 */
function formatTimeLabel(timeVal) {
    const hour = Math.floor(timeVal);
    const minute = (timeVal - hour) * 60;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export default SeatTimeline;
