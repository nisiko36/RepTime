import React, { useState } from "react";
import useReservations from "../hooks/useReservations";
import ReservationList from "../components/ReservationList";
import ReservationForm from "../components/ReservationForm";
import EditReservationModal from "../components/ReservationModal";

function ReservationsPage() {
    // Dateオブジェクトを初期値に設定
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [editingReservation, setEditingReservation] = useState(null); // 編集対象

    // useReservationsが日付文字列（YYYY-MM-DD）を受け取る前提の場合、formatDateInputで変換
    const formattedDate = formatDateInput(selectedDate);

    const {
        reservations,
        loading,
        createReservation,
        updateReservation,
        deleteReservation
    } = useReservations(formattedDate);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">予約一覧</h1>

            <div className="mt-2">
                <label>日付: </label>
                <input
                    type="date"
                    value={formatDateInput(selectedDate)}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="border p-1"
                />
            </div>

            <ReservationList
                reservations={reservations}
                loading={loading}
                updateReservation={updateReservation}
                deleteReservation={deleteReservation}
                onEdit={setEditingReservation}
            />

            <ReservationForm onCreate={createReservation} />

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
    // "YYYY-MM-DD" 形式に整形して返す
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export default ReservationsPage;
