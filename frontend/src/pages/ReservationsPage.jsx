import { useState } from "react";
import useReservations from "../hooks/useReservations";
import BookingWithMemoList from "../components/BookingWithMemoList";


function ReservationsPage() {
    const { reservations, loading, createReservation, updateReservation, deleteReservation } = useReservations();
    const [newReservation, setNewReservation] = useState({ customer_id: "", start_at: "", end_at: "", seat_number: "" });

    const handleCreate = () => {
        createReservation(newReservation);
        setNewReservation({ customer_id: "", start_at: "", end_at: "", seat_number: "" });
    };

    return (
        <div className="p-4">
        <h1 className="text-xl font-bold">予約一覧</h1>

        {loading ? <p>Loading...</p> : (
            <ul className="mt-4">
            {reservations.map((res) => (
                <li key={res.id} className="p-2 border-b flex justify-between">
                {console.log(["name",res.customer])}
                {res.customer.name} - {new Date(res.start_at).toLocaleString()} - {new Date(res.end_at).toLocaleString()}
                <div>
                    <button className="bg-green-500 text-white px-2 py-1 mx-2" onClick={() => updateReservation(res.id, { start_at: "2025-03-12T18:00:00Z" })}>更新</button>
                    <button className="bg-red-500 text-white px-2 py-1" onClick={() => deleteReservation(res.id)}>削除</button>
                </div>
                </li>
            ))}
            </ul>
        )}

        <h2 className="text-lg font-bold mt-6">新規予約</h2>
        <div className="mt-2 flex">
            <input
            type="text"
            placeholder="顧客ID"
            value={newReservation.customer_id}
            onChange={(e) => setNewReservation({ ...newReservation, customer_id: e.target.value })}
            className="border p-2 mx-2"
            />
            <input
            type="datetime-local"
            value={newReservation.start_at}
            onChange={(e) => setNewReservation({ ...newReservation, start_at: e.target.value })}
            className="border p-2 mx-2"
            />
            <input
            type="datetime-local"
            value={newReservation.end_at}
            onChange={(e) => setNewReservation({ ...newReservation, end_at: e.target.value })}
            className="border p-2 mx-2"
            />
            <input
            type="number"
            placeholder="席番号"
            value={newReservation.seat_number}
            onChange={(e) => setNewReservation({ ...newReservation, seat_number: e.target.value })}
            className="border p-2 mx-2"
            />
            <button className="bg-blue-500 text-white px-4 py-2" onClick={handleCreate}>作成</button>
        </div>
        <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">予約メモ</h1>
                <BookingWithMemoList />
        </div>

        </div>




    );
}

export default ReservationsPage;
