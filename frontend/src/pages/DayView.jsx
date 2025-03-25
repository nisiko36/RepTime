import React from "react";
import useReservations from "../hooks/useReservations";
import SeatTimeline from "../components/SeatTimeline";

const SEATS_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2"];

function DayView({ date }) {
    const { reservations, loading } = useReservations(date);

    if (loading) {
        return <p>読み込み中...</p>;
    }

    // 各席ごとに予約をフィルタリング
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
                    date={date}
                />
            ))}
        </div>
    );
}

export default DayView;
