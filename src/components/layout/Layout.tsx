import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-center text-sm text-yellow-800">
        <span className="font-medium">&#9888; 本サイトに表示されるデータはすべて架空の合成データです。実在の人物・組織とは一切関係ありません。</span>
      </div>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
