import React from "react";
import useReservations from "../hooks/useReservations";
import SeatTimeline from "../components/SeatTimeline";
import ReservationCustomerMemos from "../components/ReservationCustomerMemos";
import ShiftListForDay from "../components/ShiftListForDay";


const SEATS_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2"];

function DayView({ date }) {
    const { reservations, loading, updateReservation } = useReservations(date);

    const toJstDateString = (date) => {
        const localDate = new Date(date);
        return localDate.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).replace(/\//g, "-");
    };

    if (loading) {
        return <p>読み込み中...</p>;
    }

    const reservationsBySeat = SEATS_ORDER.map((seat) => ({
        seat,
        reservations: reservations.filter((res) =>
            (res.seat_numbers || []).includes(seat)
        )
    }));

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* 予約テーブル */}
            {reservationsBySeat.map(({ seat, reservations }) => (
                <SeatTimeline
                    key={seat}
                    seatName={seat}
                    reservations={reservations}
                    date={date} // これはUTCのまま
                    updateReservation={updateReservation}
                />
            ))}


            {/* シフト */}
            <ShiftListForDay date={toJstDateString(date)} />{/* JSTに変換して渡す */}

            {/* 顧客メモ */}
            <div className="mt-8">
                <ReservationCustomerMemos date={toJstDateString(date)} />{/* JSTに変換して渡す */}
            </div>
        </div>
    );
}
export default DayView;
