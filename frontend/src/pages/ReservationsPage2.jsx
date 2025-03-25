import React, { useState } from "react";
import DayView from "./DayView";
import MonthView from "./MonthView";
import useReservations from "../hooks/useReservations";
import ReservationList from "../components/ReservationList";
import ReservationForm from "../components/ReservationForm";
import EditReservationModal from "../components/ReservationModal";

function ReservationsPage2() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState("day"); // "day" or "month"
    const [editingReservation, setEditingReservation] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleViewChange = (mode) => {
        setViewMode(mode);
    };

    // Dayモードの場合はフォーマット済み日付、Monthモードの場合は undefined を渡す
    const queryDate = viewMode === "day" ? formatDateInput(selectedDate) : undefined;

    const {
        reservations,
        loading,
        createReservation,
        updateReservation,
        deleteReservation
    } = useReservations(queryDate);

    // Monthモードの場合、全件取得した中から選択中の月に該当する予約のみを抽出
    const filteredReservations = viewMode === "month"
    ? reservations.filter(r => {
            if (!r.start_at) return false;
            const reservationDate = new Date(r.start_at); // ← ここでUTC文字列をDate化
            const selectedYear = selectedDate.getFullYear();
            const selectedMonth = selectedDate.getMonth(); // 0始まり（1月＝0）
            return (
                reservationDate.getFullYear() === selectedYear &&
                reservationDate.getMonth() === selectedMonth
            );
        })
    : reservations;

    return (
        <div className="w-full max-w-none p-4">

            {/* 共通の日付選択＆ビュー切替 */}
            <div className="flex items-center gap-4 my-2">
                <button
                    onClick={() => handleViewChange("day")}
                    className={`px-4 py-2 ${viewMode === "day" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    Day
                </button>
                <button
                    onClick={() => handleViewChange("month")}
                    className={`px-4 py-2 ${viewMode === "month" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    Month
                </button>
                <input
                    type="date"
                    value={formatDateInput(selectedDate)}
                    onChange={(e) => handleDateChange(new Date(e.target.value))}
                    className="border p-2"
                />
            </div>

            {/* 予約可視化（グラフ）部分 */}
            {viewMode === "day" ? (
                <DayView date={selectedDate} />
            ) : (
                <MonthView
                    date={selectedDate}
                    onDateSelect={handleDateChange}
                    onSwitchToDay={() => handleViewChange("day")}
                />
            )}

            {/* 予約一覧リスト＆フォーム */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-2">予約一覧</h2>
                <ReservationList
                    reservations={filteredReservations}
                    loading={loading}
                    updateReservation={updateReservation}
                    deleteReservation={deleteReservation}
                    onEdit={setEditingReservation}
                />
                <ReservationForm onCreate={createReservation} />
            </div>

            {/* 編集モーダル */}
            {editingReservation && (
                <EditReservationModal
                    reservation={editingReservation}
                    onUpdate={updateReservation}
                    onClose={() => setEditingReservation(null)}
                    onSave={updateReservation}
                />
            )}
        </div>
    );
}

function formatDateInput(date) {
    // Dateオブジェクトを "YYYY-MM-DD" 形式に変換
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export default ReservationsPage2;
