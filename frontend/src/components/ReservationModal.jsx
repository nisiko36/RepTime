import React from "react";
import ReservationForm from "./ReservationForm";

const ReservationModal = ({ reservation, onUpdate, onClose }) => {
    if (!reservation) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">予約編集</h2>
            <ReservationForm
                editingReservation={reservation}
                onUpdate={onUpdate}
                onClose={onClose}
            />
            <button
                onClick={onClose}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
            閉じる
            </button>
        </div>
        </div>
    );
};

export default ReservationModal;
