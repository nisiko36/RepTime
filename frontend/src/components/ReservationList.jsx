// src/components/ReservationList.jsx
import React from "react";

const ReservationList = ({
    reservations,
    loading,
    updateReservation,
    deleteReservation,
    editable = true
}) => {
    if (loading) return <p>読み込み中...</p>;

    return (
        <ul className="mt-4">
            {reservations.map((res) => (
                <li key={res.id} className="p-2 border-b flex justify-between">
                    <div>
                        {res.customer.name} - {new Date(res.start_at).toLocaleString()} - {new Date(res.end_at).toLocaleString()} [{res.seat_numbers}] {res.party_size}人
                    </div>
                    {editable && (
                        <div>
                            <button
                                className="bg-green-500 text-white px-2 py-1 mx-2"
                                onClick={() => updateReservation(res.id, { start_at: "2025-03-12T18:00:00Z" })}
                            >
                                更新
                            </button>
                            <button
                                className="bg-red-500 text-white px-2 py-1"
                                onClick={() => deleteReservation(res.id)}
                            >
                                削除
                            </button>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default ReservationList;
