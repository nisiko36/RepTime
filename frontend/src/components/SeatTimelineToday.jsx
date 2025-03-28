import React from "react";
import useReservations from "../hooks/useReservations";
import SeatTimeline from "./SeatTimeline"; 

const SEATS_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2"];

const getTodayDateString = () => {
    const today = new Date();
    return today.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).replace(/\//g, "-"); // "YYYY-MM-DD"
};


const SeatTimelineToday = () => {
    const today = getTodayDateString();
    const { reservations, loading } = useReservations(today);

    if (loading) {
        return <p className="text-gray-500">読み込み中...</p>;
    }

    // 各席ごとにフィルタリング
    const reservationsBySeat = SEATS_ORDER.map((seat) => ({
        seat,
        reservations: reservations.filter((res) =>
            (res.seat_numbers || []).includes(seat)
        )
    }));

    return (
        <div className="max-w-4xl mx-auto p-4">
            {reservationsBySeat.map(({ seat, reservations }) => (
                <SeatTimeline
                    key={seat}
                    seatName={seat}
                    reservations={reservations}
                    date={today}
                />
            ))}
        </div>
    );
};

export default SeatTimelineToday;
