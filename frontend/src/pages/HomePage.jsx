import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div className="text-center p-4">
            <h1 className="text-2xl font-bold">RepTime</h1>
            <p className="mt-4">居酒屋向けの予約・勤怠管理システム</p>
            <div className="mt-6">
                <Link to="/users" className="bg-blue-500 text-white px-4 py-2 rounded">
                従業員一覧へ
                </Link>
                <Link to="/reservations" className="bg-blue-500 text-white px-4 py-2 rounded">
                予約一覧へ
                </Link>
                <Link to="/shifts" className="bg-blue-500 text-white px-4 py-2 rounded">
                シフト一覧へ
                </Link>
                <Link to="/owner-messages" className="bg-blue-500 text-white px-4 py-2 rounded">
                オーナーメッセージ
                </Link>
            </div>
        </div>
    );
}

export default HomePage;
