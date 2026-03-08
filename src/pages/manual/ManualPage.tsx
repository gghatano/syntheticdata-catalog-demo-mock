import { Link } from "react-router-dom";
import { loadState } from "../../store/session";
import { USERS } from "../../data/users";

export function ManualPage() {
  const state = loadState();
  const user = USERS.find((u) => u.user_id === state.currentUserId);
  const isHr = user?.role === "hr";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-100">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">📖</span>
          <h1 className="text-3xl font-bold text-gray-800">操作マニュアル</h1>
        </div>
        <p className="text-gray-600 text-lg">
          合成データカタログの使い方をわかりやすく解説しています。
          あなたの役割に合ったマニュアルをご覧ください。
        </p>
      </div>

      {/* Role-based recommendation */}
      {user && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">👤</span>
          <div>
            <p className="font-semibold text-green-800">
              {user.display_name}さん（{isHr ? "データオーナー" : "データ利用者"}）向けのマニュアル
            </p>
            <p className="text-sm text-green-700 mt-0.5">
              あなたには{" "}
              <Link
                to={isHr ? "/manual/hr" : "/manual/proposer"}
                className="font-bold underline"
              >
                {isHr ? "データオーナー向けマニュアル" : "データ利用者向けマニュアル"}
              </Link>{" "}
              がおすすめです。
            </p>
          </div>
        </div>
      )}

      {/* Manual Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link
          to="/manual/hr"
          className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border-t-4 border-blue-500 p-6 flex flex-col"
        >
          <div className="text-5xl mb-4">🏢</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
            データオーナー向けマニュアル
          </h2>
          <p className="text-gray-500 text-sm flex-1">
            人事・データ管理部門の方向け。データセットの公開・管理、合成データ生成、
            利用提案のレビュー、実行管理などの操作手順を解説します。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["データセット管理", "合成データ生成", "提案レビュー", "実行管理"].map((tag) => (
              <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4 text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            マニュアルを見る →
          </div>
        </Link>

        <Link
          to="/manual/proposer"
          className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border-t-4 border-green-500 p-6 flex flex-col"
        >
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
            データ利用者向けマニュアル
          </h2>
          <p className="text-gray-500 text-sm flex-1">
            データを活用したい研究者・分析者の方向け。データセットの探し方、
            活用提案の作成、合成データの実行リクエストなどを解説します。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["データ検索", "活用提案", "実行リクエスト", "コミュニティ"].map((tag) => (
              <span key={tag} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4 text-green-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            マニュアルを見る →
          </div>
        </Link>
      </div>

      {/* Glossary Card */}
      <Link
        to="/manual/glossary"
        className="group block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border-t-4 border-purple-400 p-6"
      >
        <div className="flex items-center gap-4">
          <div className="text-5xl">📚</div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">
              用語集
            </h2>
            <p className="text-gray-500 text-sm">
              システムで使われている専門用語をわかりやすく解説しています。
              各用語から関連する操作手順へのリンクもあります。
            </p>
          </div>
          <div className="text-purple-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
            →
          </div>
        </div>
      </Link>

      {/* Quick Links */}
      <div className="bg-gray-50 rounded-xl p-5">
        <h2 className="font-semibold text-gray-700 mb-3">クイックリンク</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <Link to="/dashboard" className="text-blue-600 hover:underline">ダッシュボードへ戻る</Link>
          <Link to="/manual/hr#step1" className="text-blue-600 hover:underline">データセット管理</Link>
          <Link to="/manual/proposer#step1" className="text-blue-600 hover:underline">データを探す</Link>
          <Link to="/manual/glossary" className="text-blue-600 hover:underline">用語を調べる</Link>
        </div>
      </div>
    </div>
  );
}
