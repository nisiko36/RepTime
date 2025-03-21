import useReservations from "../hooks/useReservations";
import ReservationList from "../components/ReservationList";
import ReservationForm from "../components/ReservationForm";
import BookingWithMemoList from "../components/BookingWithMemoList";

function ReservationsPage() {
    const {
        reservations,
        loading,
        createReservation,
        updateReservation,
        deleteReservation
    } = useReservations();

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">予約一覧</h1>
            <ReservationList
                reservations={reservations}
                loading={loading}
                updateReservation={updateReservation}
                deleteReservation={deleteReservation}
            />

            <ReservationForm onCreate={createReservation} />

            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">予約メモ</h1>
                <BookingWithMemoList />
            </div>
        </div>
    );
}

export default ReservationsPage;
