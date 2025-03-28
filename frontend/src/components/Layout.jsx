import { Outlet, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Layout = () => {
    const { user } = useAuth();
    return (
        <div className="flex flex-col h-screen">
            {/* ヘッダー */}
            <header className="bg-blue-600 text-white px-6 py-4 shadow w-full">
                <h1 className="text-2xl font-semibold">RepTime or MatakiTimeApp</h1>
            </header>

            {/* ヘッダー下の全体レイアウト */}
            <div className="flex flex-1">
                {/* サイドバー */}
                <aside className="w-64 bg-gray-800 text-white p-6">
                    <h2 className="text-xl font-bold mb-6">メニュー</h2>
                        User：<span className="text-2xl font-semibold text-white">
                            {user?.name || "ゲスト"}
                        </span>

                    <nav className="flex flex-col space-y-4 mt-6">
                        <Link to="/" className="hover:underline">ホーム</Link>
                        <Link to="/reservations2" className="hover:underline">予約状況</Link>
                        <Link to="/customers" className="hover:underline">顧客</Link>
                        <Link to="/users" className="hover:underline">従業員</Link>
                        <Link to="/time-clock" className="hover:underline">勤怠打刻</Link>
                        <Link to="/owner-messages" className="hover:underline">オーナー伝言板</Link>
                        <Link to="/shifts" className="hover:underline">シフト</Link>
                        <Link to="/login" className="hover:underline text-red-400">ログアウト</Link>
                    </nav>
                </aside>

                {/* メインコンテンツ */}
                <main className="flex-1 overflow-auto bg-brack w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
