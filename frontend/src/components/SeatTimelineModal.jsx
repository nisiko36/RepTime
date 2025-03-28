import React, { useState, useEffect } from "react";
import ReservationForm from "./ReservationForm";
import CustomerMemos from "../components/CustomerMemos";

const SeatTimelineModal = ({ reservation, onUpdateReservation, onClose, date }) => {
    const [form, setForm] = useState({
        start_at: "",
        end_at: "",
        seat_numbers: "",
        party_size: ""
    });
    const [updating, setUpdating] = useState(false);

    // モーダル表示中は背景スクロール禁止
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    // フォーム初期化
    useEffect(() => {
        if (reservation) {
            setForm({
                start_at: reservation.start_at,
                end_at: reservation.end_at,
                seat_numbers: reservation.seat_numbers.join(", "),
                party_size: reservation.party_size || ""
            });
        }
    }, [reservation]);

    const formatDateTimeLocal = (dt) => {
        if (!dt) return "";
        const jst = new Date(dt).toLocaleString("sv-SE", { timeZone: "Asia/Tokyo" });
        return jst.replace(" ", "T").slice(0, 16);
    };

    const handleSubmit = async () => {
        setUpdating(true);
        const seatArray = form.seat_numbers
            .split(",")
            .map(s => s.trim())
            .filter(s => s.length > 0);

        const updatedData = {
            start_at: new Date(form.start_at).toISOString(),
            end_at: new Date(form.end_at).toISOString(),
            seat_numbers: seatArray,
            party_size: form.party_size
        };

        try {
            await onUpdateReservation(reservation.id, updatedData);
        } catch (error) {
            console.error("Error updating reservation:", error);
        } finally {
            setUpdating(false);
            onClose();
        }
    };
    const seatOptions = [
        "A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2",
        "A1,A2", "B1,B2", "C1,C2", "D1,D2"
    ];


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-gray-800 p-8 rounded shadow-lg w-[90vw] h-[80vh] overflow-hidden flex flex-col">

                {/* ✕ 閉じるボタン */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-white text-2xl font-bold hover:text-gray-400"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold mb-4 text-white text-center">予約編集</h2>

                <div className="flex flex-1 gap-6">
                    {/* 左フォーム */}
                    <div className="w-1/2 space-y-4 overflow-y-auto pr-2">
                        <p className="text-white font-semibold">
                            顧客: {reservation.customer?.name || `ID: ${reservation.customer_id}`}
                        </p>

                        <div>
                            <label className="block text-sm font-medium text-white">開始時刻</label>
                            <input
                                type="datetime-local"
                                value={formatDateTimeLocal(form.start_at)}
                                onChange={(e) => setForm({ ...form, start_at: e.target.value })}
                                className="border p-2 w-full rounded mt-1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white">終了時刻</label>
                            <input
                                type="datetime-local"
                                value={formatDateTimeLocal(form.end_at)}
                                onChange={(e) => setForm({ ...form, end_at: e.target.value })}
                                className="border p-2 w-full rounded mt-1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white">席番号</label>
                            <select
                                value={form.seat_numbers}
                                onChange={(e) => setForm({ ...form, seat_numbers: e.target.value })}
                                className="border p-2 w-full rounded mt-1"
                            >
                                <option value="">-- 席を選択してください --</option>
                                {seatOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white">人数</label>
                            <input
                                type="number"
                                value={form.party_size}
                                onChange={(e) => setForm({ ...form, party_size: e.target.value })}
                                className="border p-2 w-full rounded mt-1"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full"
                            disabled={updating}
                        >
                            {updating ? "更新中..." : "更新"}
                        </button>
                    </div>

                    {/* 右メモ */}
                    {reservation.customer && (
                        <div className="w-1/2 flex flex-col">
                            <h3 className="text-lg font-bold mb-2 text-white">顧客メモ</h3>
                            <div className="flex-1 overflow-y-auto max-h-[60vh] pr-2">
                                <CustomerMemos
                                    customerId={reservation.customer.id}
                                    customerName={reservation.customer.name}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SeatTimelineModal;
