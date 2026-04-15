import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const ADMIN_EMAIL = "ssolomonprojects@gmail.com";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    checkAdmin();
    fetchUsers();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) {
      navigate("/dashboard");
      return;
    }
    setCurrentUser(user);
  };

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setUsers(data || []);
    setLoading(false);
  };

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.college?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total Users", value: users.length, icon: "👥", color: "bg-indigo-50 text-indigo-600" },
    { label: "With College", value: users.filter(u => u.college).length, icon: "🎓", color: "bg-emerald-50 text-emerald-600" },
    { label: "Today", value: users.filter(u => new Date(u.created_at).toDateString() === new Date().toDateString()).length, icon: "📅", color: "bg-amber-50 text-amber-600" },
    { label: "This Week", value: users.filter(u => new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, icon: "📊", color: "bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white flex flex-col fixed h-screen">
        <div className="px-6 py-5 border-b border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
          onClick={() => navigate("/dashboard")}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">🎓</div>
            <div>
              <p className="font-bold text-base leading-tight">PlaceAI</p>
              <p className="text-xs text-indigo-200">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { icon: "👥", label: "All Users", id: "users" },
            { icon: "📊", label: "Analytics", id: "analytics" },
            { icon: "🏢", label: "Companies", id: "companies" },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? "bg-white/20 text-white" : "text-indigo-100 hover:bg-white/10"}`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-semibold text-sm">
              {currentUser?.email?.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">Admin</p>
              <p className="text-xs text-indigo-200 truncate">{currentUser?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-xs text-gray-400">Manage all PlaceAI users</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchUsers}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition-colors font-medium">
              🔄 Refresh
            </button>
            <button onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-xl hover:bg-gray-200 transition-colors font-medium">
              ← Back to App
            </button>
          </div>
        </header>

        <main className="flex-1 px-6 py-6">

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-xl mb-3`}>
                  {s.icon}
                </div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Users Table */}
          {activeTab === "users" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 text-sm">All Users ({filtered.length})</h2>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input type="text" placeholder="Search users..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 bg-gray-50 w-64" />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-16">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Loading users...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-4xl mb-3">👥</div>
                  <p className="text-gray-500 font-medium">No users found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-50 bg-gray-50/50">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">#</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">College</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Joined</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((user, i) => (
                        <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-3.5 text-gray-400 text-xs">{i + 1}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {user.full_name?.slice(0, 2).toUpperCase() || user.email?.slice(0, 2).toUpperCase() || "??"}
                              </div>
                              <span className="font-medium text-gray-800">{user.full_name || "—"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-gray-500">{user.email || "—"}</td>
                          <td className="px-4 py-3.5 text-gray-500">{user.college || "—"}</td>
                          <td className="px-4 py-3.5 text-gray-400 text-xs">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">Active</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Top Colleges</h3>
                {Object.entries(
                  users.reduce((acc, u) => {
                    if (u.college) acc[u.college] = (acc[u.college] || 0) + 1;
                    return acc;
                  }, {})
                ).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([college, count], i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-700 truncate flex-1">{college}</span>
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium ml-2">{count} users</span>
                  </div>
                ))}
                {users.filter(u => u.college).length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-8">No college data yet</p>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">User Growth</h3>
                <div className="space-y-3">
                  {[
                    { label: "Total Users", value: users.length, color: "bg-indigo-500" },
                    { label: "Have College Info", value: users.filter(u => u.college).length, color: "bg-emerald-500" },
                    { label: "Joined Today", value: users.filter(u => new Date(u.created_at).toDateString() === new Date().toDateString()).length, color: "bg-amber-500" },
                    { label: "Joined This Week", value: users.filter(u => new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, color: "bg-violet-500" },
                  ].map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{s.label}</span>
                        <span className="font-semibold text-gray-800">{s.value}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className={`${s.color} h-2 rounded-full transition-all duration-1000`}
                          style={{ width: users.length > 0 ? `${(s.value / users.length) * 100}%` : "0%" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Companies Tab */}
          {activeTab === "companies" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Companies in System</h3>
              <p className="text-gray-500 text-sm">50 companies loaded from companies.json</p>
              <button onClick={() => navigate("/companies")}
                className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                View Companies Page →
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}