import { Link, useLocation, useNavigate } from "react-router-dom";
import { USERS } from "../../data/users";
import { getCurrentUserId, logout } from "../../store/session";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = getCurrentUserId();
  const user = USERS.find((u) => u.user_id === userId);

  const isActive = (path: string) =>
    path === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  const navLinkClass = (path: string) =>
    isActive(path)
      ? "text-white font-bold border-b-2 border-white pb-0.5"
      : "text-blue-100 hover:text-white";

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
                <Link to="/dashboard" className={navLinkClass("/dashboard")}>ダッシュボード</Link>
                <Link to="/datasets" className={navLinkClass("/datasets")}>データセット</Link>
                <Link to="/proposals" className={navLinkClass("/proposals")}>提案</Link>
                <Link to="/submissions" className={navLinkClass("/submissions")}>分析実行</Link>
                <Link to="/community" className={navLinkClass("/community")}>全体の提案</Link>
                <Link to="/data-requests" className={navLinkClass("/data-requests")}>データ公開リクエスト</Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm">
            {user ? (
              <>
                <Link to="/manual" className={navLinkClass("/manual")}>📖 マニュアル</Link>
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
