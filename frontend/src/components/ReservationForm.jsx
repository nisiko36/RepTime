import React, { useState, useEffect } from "react";

const ReservationForm = ({ onCreate, onUpdate, editingReservation, onClose }) => {
    const [form, setForm] = useState({
        customer_id: "",
        start_at: "",
        end_at: "",
        seat_numbers: ""
    });

    useEffect(() => {
        if (editingReservation) {
        setForm({
            customer_id: editingReservation.customer_id,
            start_at: editingReservation.start_at,
            end_at: editingReservation.end_at,
            seat_numbers: editingReservation.seat_numbers.join(", ")
        });
        }
    }, [editingReservation]);

    const handleSubmit = () => {
        // カンマ区切りの文字列を配列に変換
        const seatArray = form.seat_numbers
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

        const reservationData = {
            customer_id: form.customer_id,
            start_at: new Date(form.start_at).toISOString(), // ← UTCに変換
            end_at: new Date(form.end_at).toISOString(),
            seat_numbers: seatArray
            };


        if (editingReservation) {
            onUpdate(editingReservation.id, reservationData);
        if (onClose) onClose();
        } else {
        onCreate(reservationData);
        setForm({
            customer_id: "",
            start_at: "",
            end_at: "",
            seat_numbers: ""
        });
        }
    };
    const formatDateTimeLocal = (dt) => {
        if (!dt) return "";
        const jst = new Date(dt).toLocaleString("sv-SE", { timeZone: "Asia/Tokyo" });
        return jst.replace(" ", "T").slice(0, 16); // YYYY-MM-DDTHH:mm
    };


    return (
        <div>
            <h2 className="text-lg font-bold mt-6">
                {editingReservation ? "予約編集" : "新規予約"}
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
                {/* <input
                    type="text"
                    placeholder="顧客ID"
                    value={form.customer_id}
                    onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                    className="border p-2"
                /> */}

                <input
                    type="datetime-local"
                    value={formatDateTimeLocal(form.start_at)}
                    onChange={(e) => setForm({ ...form, start_at: e.target.value })}
                    className="border p-2"
                />
                <input
                    type="datetime-local"
                    value={formatDateTimeLocal(form.end_at)}
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
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2"
                >
                {editingReservation ? "更新" : "作成"}
                </button>
            </div>
        </div>
    );
};

export default ReservationForm;
