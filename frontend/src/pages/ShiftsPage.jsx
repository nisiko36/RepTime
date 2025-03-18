import { useState } from "react";
import useShifts from "../hooks/useShifts";

function ShiftsPage() {
    const { shifts, loading, createShift, updateShift, deleteShift } = useShifts();
    const [newShift, setNewShift] = useState({ user_id: "", check_in: "", check_out: "", breaks: "{}" });

    const handleCreate = () => {
        createShift(newShift);
        setNewShift({ user_id: "", check_in: "", check_out: "", breaks: "{}" });
    };

    return (
        <div className="p-4">
        <h1 className="text-xl font-bold">シフト一覧</h1>

        {loading ? <p>Loading...</p> : (
            <ul className="mt-4">
            {shifts.map((shift) => (
                <li key={shift.id} className="p-2 border-b flex justify-between">
                {shift.user.name} - {new Date(shift.check_in).toLocaleString()} 〜 {new Date(shift.check_out).toLocaleString()}
                <div>
                    <button className="bg-green-500 text-white px-2 py-1 mx-2" onClick={() => updateShift(shift.id, { check_in: "2025-03-17T09:00:00Z" })}>更新</button>
                    <button className="bg-red-500 text-white px-2 py-1" onClick={() => deleteShift(shift.id)}>削除</button>
                </div>
                </li>
            ))}
            </ul>
        )}

        <h2 className="text-lg font-bold mt-6">新規シフト</h2>
        <div className="mt-2 flex">
            <input
            type="text"
            placeholder="従業員ID"
            value={newShift.user_id}
            onChange={(e) => setNewShift({ ...newShift, user_id: e.target.value })}
            className="border p-2 mx-2"
            />
            <input
            type="datetime-local"
            value={newShift.check_in}
            onChange={(e) => setNewShift({ ...newShift, check_in: e.target.value })}
            className="border p-2 mx-2"
            />
            <input
            type="datetime-local"
            value={newShift.check_out}
            onChange={(e) => setNewShift({ ...newShift, check_out: e.target.value })}
            className="border p-2 mx-2"
            />
            <button className="bg-blue-500 text-white px-4 py-2" onClick={handleCreate}>作成</button>
        </div>
        </div>
    );
}

export default ShiftsPage;
