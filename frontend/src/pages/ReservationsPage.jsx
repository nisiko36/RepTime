import React, { useState } from "react";
import useReservations from "../hooks/useReservations";
import ReservationList from "../components/ReservationList";
import ReservationForm from "../components/ReservationForm";

function ReservationsPage() {
    const [selectedDate, setSelectedDate] = useState("");

    // ここで、日付をフックに渡す
    const {
        reservations,
        loading,
        createReservation,
        updateReservation,
        deleteReservation
    } = useReservations(selectedDate);

    return (
        <div className="p-4">
        <h1 className="text-xl font-bold">予約一覧</h1>

        <div className="mt-2">
            <label>日付: </label>
            <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border p-1"
            />
        </div>

        <ReservationList
            reservations={reservations}
            loading={loading}
            updateReservation={updateReservation}
            deleteReservation={deleteReservation}
        />

        <ReservationForm onCreate={createReservation} />
        </div>
    );
}

export default ReservationsPage;
