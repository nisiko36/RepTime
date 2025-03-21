import React, { useEffect, useState } from "react";
import { fetchBookingsWithMemo } from "../api/squareApi";

const BookingWithMemoList = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchBookingsWithMemo();
            setBookings(data);
        };
        loadData();
    }, []);

    return (
        <div className="p-4">
        <h2 className="text-xl font-bold mb-4">📒 予約 & 顧客メモ一覧</h2>
        <ul className="space-y-4">
            {bookings.map((b) => (
            <li key={b.id} className="border p-4 rounded shadow">
                <p><strong>👤 顧客名:</strong> {b.customer_name}</p>
                <p><strong>🕒 開始時間:</strong> {new Date(b.start_at).toLocaleString()}</p>
                <p><strong>⏱️ 時間:</strong> {b.duration_minutes}分</p>
                <p><strong>📝 個人メモ:</strong> {b.personal_memos.join(", ")}</p>
                <p><strong>📢 共有メモ:</strong> {b.shared_memos.join(", ")}</p>
            </li>
            ))}
        </ul>
        </div>
    );
};

export default BookingWithMemoList;
