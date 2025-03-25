import React from "react";

const ReservationList = ({ reservations, loading, deleteReservation, onEdit }) => {
    if (loading) return <p>Loading...</p>;

    // 昇順に並び替え（start_atの早い順）
    const sortedReservations = reservations
        .slice() // 元配列を破壊しないため
        .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));

    return (
        <div>
            {sortedReservations.map((reservation) => (
                <div key={reservation.id} className="border p-2 flex justify-between items-center">
                    <div>
                        <p>顧客ID: {reservation.customer_id}</p>
                        <p>開始: {new Date(reservation.start_at).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}</p>
                        <p>終了: {new Date(reservation.end_at).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}</p>
                        <p>席番号: {reservation.seat_numbers.join(", ")}</p>
                    </div>
                    <div>
                        <button
                            className="bg-green-500 text-white px-2 py-1 mx-2"
                            onClick={() => onEdit(reservation)}
                        >
                            編集
                        </button>
                        <button
                            className="bg-red-500 text-white px-2 py-1"
                            onClick={() => deleteReservation(reservation.id)}
                        >
                            削除
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReservationList;
