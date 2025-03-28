import React from "react";
import useCustomerMemos from "../hooks/useCustomerMemos";
import { formatTime } from "../utils/dateUtils";

const ReservationMemosDisplay = ({ reservation, date }) => {
    const { memos, loading } = useCustomerMemos(reservation.customer.id);
    const formattedDate = date.toISOString().split("T")[0];

    if (loading) return <p>メモを読み込み中…</p>;

    const todaysMemos = memos.filter((memo) => {
        const memoDate = new Date(memo.created_at).toISOString().split("T")[0];
        return memoDate === formattedDate;
    });

    if (todaysMemos.length === 0) return null;

    const personalMemos = todaysMemos.filter((memo) => !memo.is_shared);
    const sharedMemos = todaysMemos.filter((memo) => memo.is_shared);

    return (
        <div className="border p-4 mb-4 rounded shadow-sm">
            <h3 className="font-bold mb-2">
                {formatTime(reservation.start_at)} - {reservation.customer.name}
            </h3>

            {personalMemos.length > 0 && (
                <div className="mb-2">
                    <h4 className="font-semibold">個人メモ</h4>
                    <ul className="list-disc ml-6">
                        {personalMemos.map((memo) => (
                            <li key={memo.id} className="whitespace-pre-wrap">
                                {memo.content}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {sharedMemos.length > 0 && (
                <div>
                    <h4 className="font-semibold">共有メモ</h4>
                    <ul className="list-disc ml-6">
                        {sharedMemos.map((memo) => (
                            <li key={memo.id} className="whitespace-pre-wrap">
                                {memo.content}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ReservationMemosDisplay;
