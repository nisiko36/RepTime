import { useState } from "react";
import useUsers from "../hooks/useUsers";
import useAuth from "../hooks/useAuth";
import UserEditModal from "../components/UserEditModal";

function UsersPage() {
    // 作成と削除の機能をなくした
    // const { users, loading, createUser, updateUser, deleteUser } = useUsers();
    const { users, loading, updateUser} = useUsers();

    const { user: currentUser } = useAuth();
    // const [newUser, setNewUser] = useState({ name: "", email: "", role: "staff" });
    const [selectedUser, setSelectedUser] = useState(null);

    // const handleCreate = () => {
    //     createUser(newUser);
    //     setNewUser({ name: "", email: "", role: "staff" });
    // };

    return (
        <div className="p-4">
        <h1 className="text-xl font-bold">ユーザー一覧</h1>

        {loading ? (
            <p>Loading...</p>
        ) : (
            <ul className="mt-4">
            {users.map((user) => (
                <li key={user.id} className="p-2 border-b flex justify-between items-center">
                <div>
                    {user.name} - {user.email} ({user.role}) ⭐️キッチン:{user.rank_kitchen} ホール:{user.rank_hall}
                </div>

                {/* オーナーのみ操作可能 */}
                {currentUser?.role === "owner" && (
                    <div className="flex space-x-2">
                    <button
                        className="bg-green-500 text-white px-2 py-1"
                        onClick={() => setSelectedUser(user)}
                    >
                        編集
                    </button>
                    {/* <button
                        className="bg-red-500 text-white px-2 py-1"
                        onClick={() => deleteUser(user.id)}
                    >
                        削除
                    </button> */}
                    </div>
                )}
                </li>
            ))}
            </ul>
        )}

        {/* オーナーのみ新規作成フォームを表示 */}
        {/* {currentUser?.role === "owner" && (
            <>
            <h2 className="text-lg font-bold mt-6">新規ユーザー</h2>
            <div className="mt-2 flex">
                <input
                type="text"
                placeholder="名前"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="border p-2 mx-2"
                />
                <input
                type="email"
                placeholder="メール"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="border p-2 mx-2"
                />
                <button className="bg-blue-500 text-white px-4 py-2" onClick={handleCreate}>
                作成
                </button>
            </div>
            </>
        )} */}

        {/* モーダル表示（オーナーのみ） */}
        {selectedUser && (
            <UserEditModal
            user={selectedUser}
            onSave={(updatedData) => {
                updateUser(selectedUser.id, updatedData);
                setSelectedUser(null);
            }}
            onClose={() => setSelectedUser(null)}
            />
        )}
        </div>
    );
}

export default UsersPage;
