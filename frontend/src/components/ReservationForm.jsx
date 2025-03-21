// src/components/ReservationForm.jsx
import React, { useState } from "react";

const ReservationForm = ({ onCreate }) => {
    const [form, setForm] = useState({
        customer_id: "",
        start_at: "",
        end_at: "",
        seat_number: ""
    });

    const handleCreate = () => {
        onCreate(form);
        setForm({ customer_id: "", start_at: "", end_at: "", seat_number: "" });
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
                    type="number"
                    placeholder="席番号"
                    value={form.seat_number}
                    onChange={(e) => setForm({ ...form, seat_number: e.target.value })}
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
