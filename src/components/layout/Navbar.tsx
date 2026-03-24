import { Link, useNavigate } from "react-router-dom";
import { USERS } from "../../data/users";
import { getCurrentUserId, logout } from "../../store/session";

export function Navbar() {
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const user = USERS.find((u) => u.user_id === userId);

  const isHr = user?.role === "hr";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-[var(--color-primary)] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link to={user ? "/dashboard" : "/login"} className="font-bold text-lg">
              合成データカタログ（画面のみ）
            </Link>
            {user && (
              <div className="flex gap-4 text-sm">
                <Link to="/dashboard" className="hover:text-blue-200">ダッシュボード</Link>
                {isHr ? (
                  <>
                    <Link to="/hr/datasets" className="hover:text-blue-200">データセット</Link>
                    <Link to="/hr/proposals" className="hover:text-blue-200">提案レビュー</Link>
                    <Link to="/hr/submissions" className="hover:text-blue-200">分析実行管理</Link>
                  </>
                ) : (
                  <>
                    <Link to="/proposer/datasets" className="hover:text-blue-200">データセット</Link>
                    <Link to="/proposer/proposals" className="hover:text-blue-200">マイ提案</Link>
                    <Link to="/proposer/submissions" className="hover:text-blue-200">マイ分析実行</Link>
                    <Link to="/proposer/community" className="hover:text-blue-200">全体の提案</Link>
                    <Link to="/proposer/data-requests" className="hover:text-blue-200">データ公開リクエスト</Link>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm">
            {user ? (
              <>
                <Link to="/manual" className="hover:text-blue-200">📖 マニュアル</Link>
                <span>{user.display_name}（{user.department}）</span>
                <button onClick={handleLogout} className="hover:text-blue-200">
                  ログアウト
                </button>
              </>
            ) : (
              <span className="text-blue-200 text-xs">デモサイト</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
