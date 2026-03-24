import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { USERS } from "../data/users";
import { login } from "../store/session";
import { ActionButton } from "../components/common/ActionButton";
import { Navbar } from "../components/layout/Navbar";

export function LoginPage() {
  const [selectedUser, setSelectedUser] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!selectedUser) return;
    login(selectedUser);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-center text-sm text-yellow-800">
        <span className="font-medium">&#9888; 本サイトに表示されるデータはすべて架空の合成データです。実在の人物・組織とは一切関係ありません。</span>
      </div>
      <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 110px)" }}>
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-[var(--color-primary)] mb-2">
            合成データカタログ（画面のみ）
          </h1>
          <p className="text-gray-500 text-center text-sm mb-8">
            プライバシーを保護しながらデータ活用を推進するプラットフォーム
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">ユーザーを選択</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">-- 選択してください --</option>
              {USERS.map((u) => (
                <option key={u.user_id} value={u.user_id}>
                  {u.display_name}（{u.role === "hr" ? "データオーナー" : "提案者"} / {u.department}）
                </option>
              ))}
            </select>
          </div>

          <ActionButton onClick={handleLogin} disabled={!selectedUser} className="w-full">
            ログイン
          </ActionButton>

          <p className="text-xs text-gray-400 text-center mt-6">
            これはデモサイトです。実際の認証は行われません。
          </p>
        </div>
      </div>
    </div>
  );
}
