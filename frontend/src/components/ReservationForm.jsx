import React, { useState } from "react";

const ReservationForm = ({ onCreate }) => {
    const [form, setForm] = useState({
        customer_id: "",
        start_at: "",
        end_at: "",
        seat_numbers: ""
    });

    const handleCreate = () => {
        // カンマ区切りを配列に変換
        const seatArray = form.seat_numbers
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

        const reservationData = {
            customer_id: form.customer_id,
            start_at: form.start_at,
            end_at: form.end_at,
            seat_numbers: seatArray
        };

        onCreate(reservationData);

        setForm({
            customer_id: "",
            start_at: "",
            end_at: "",
            seat_numbers: ""
        });
    };

    return (
        <>
        <h2 className="text-lg font-bold mt-6">新規予約</h2>
        <div className="mt-2 flex flex-wrap gap-2">
            <input
                type="text"
                placeholder="顧客ID"
                value={form.customer_id}
                onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                className="border p-2"
            />
            <input
                type="datetime-local"
                value={form.start_at}
                onChange={(e) => setForm({ ...form, start_at: e.target.value })}
                className="border p-2"
            />
            <input
                type="datetime-local"
                value={form.end_at}
                onChange={(e) => setForm({ ...form, end_at: e.target.value })}
                className="border p-2"
            />
            <input
                type="text"
                placeholder="席番号(カンマ区切り)"
                value={form.seat_numbers}
                onChange={(e) => setForm({ ...form, seat_numbers: e.target.value })}
                className="border p-2"
            />
            <button
                className="bg-blue-500 text-white px-4 py-2"
                onClick={handleCreate}
            >
            作成
            </button>
        </div>
        </>
    );
};

export default ReservationForm;
