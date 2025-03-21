import { Link } from "react-router-dom";
import OwnerMessageList from "../components/OwnerMessageList";
import CustomerMemos from "../components/CustomerMemos";
import useReservations from "../hooks/useReservations";
import ReservationList from "../components/ReservationList";



// テストとして表示したい Square 顧客ID の登録済みの customerId を使う
const testCustomerId = "1";

function HomePage() {
    const { reservations, loading } = useReservations();
    return (
        <div className="text-center p-4">
            <h1>Home</h1>
            <div className="p-6">
            <CustomerMemos customerId={testCustomerId} />
            </div>

            <section className="mb-6">
                <h2 className="text-lg font-semibold mb-2">オーナーメッセージ</h2>
                <OwnerMessageList />
            </section>

            <div className="p-4">
                <h1 className="text-xl font-bold">本日の予約一覧</h1>
                <ReservationList
                    reservations={reservations}
                    loading={loading}
                    editable={false}
                />
            </div>
        </div>

    );
}

export default HomePage;
