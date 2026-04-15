import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const ADMIN_EMAIL = "ssolomonprojects@gmail.com";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    checkAdmin();
    fetchAllData();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) {
      navigate("/dashboard");
      return;
    }
    setCurrentUser(user);
  };

  const fetchAllData = async () => {
    setLoading(true);
    const [profilesRes, appsRes, progressRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("applications").select("*").order("created_at", { ascending: false }),
      supabase.from("progress").select("*"),
    ]);
    if (!profilesRes.error) setUsers(profilesRes.data || []);
    if (!appsRes.error) setApplications(appsRes.data || []);
    if (!progressRes.error) setProgress(progressRes.data || []);
    setLoading(false);
  };

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.college?.toLowerCase().includes(search.toLowerCase())
  );

  const getUserApplications = (userId) => applications.filter(a => a.user_id === userId);
  const getUserProgress = (userId) => progress.find(p => p.user_id === userId);

  const stats = [
    { label: "Total Users", value: users.length, icon: "👥", color: "bg-indigo-50 text-indigo-600" },
    { label: "Total Applications", value: applications.length, icon: "📋", color: "bg-emerald-50 text-emerald-600" },
    { label: "Joined Today", value: users.filter(u => new Date(u.created_at).toDateString() === new Date().toDateString()).length, icon: "📅", color: "bg-amber-50 text-amber-600" },
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
            { icon: "📋", label: "Applications", id: "applications" },
            { icon: "📊", label: "Progress Data", id: "progress" },
            { icon: "🏆", label: "Analytics", id: "analytics" },
          ].map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSelectedUser(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? "bg-white/20 text-white" : "text-indigo-100 hover:bg-white/10"}`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-semibold text-sm">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">Admin</p>
              <p className="text-xs text-indigo-200 truncate">{currentUser?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-64 flex flex-col">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-base font-semibold text-gray-900">
              {activeTab === "users" && "All Users"}
              {activeTab === "applications" && "All Applications"}
              {activeTab === "progress" && "User Progress"}
              {activeTab === "analytics" && "Analytics"}
            </h1>
            <p className="text-xs text-gray-400">PlaceAI Admin Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchAllData}
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

          {/* Loading */}
          {loading ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Loading data...</p>
            </div>
          ) : (
            <>
              {/* USERS TAB */}
              {activeTab === "users" && !selectedUser && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900 text-sm">All Users ({filtered.length})</h2>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input type="text" placeholder="Search by name, email, college..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 bg-gray-50 w-72" />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-50 bg-gray-50/50">
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">#</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Name</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Email</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">College</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Apps</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Joined</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((user, i) => (
                          <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-3.5 text-gray-400 text-xs">{i + 1}</td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                  {user.full_name?.slice(0, 2).toUpperCase() || "??"}
                                </div>
                                <span className="font-medium text-gray-800">{user.full_name || "—"}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-gray-500">{user.email || "—"}</td>
                            <td className="px-4 py-3.5 text-gray-500">{user.college || "—"}</td>
                            <td className="px-4 py-3.5">
                              <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium">
                                {getUserApplications(user.id).length} apps
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-gray-400 text-xs">
                              {new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                            <td className="px-4 py-3.5">
                              <button onClick={() => setSelectedUser(user)}
                                className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* USER DETAIL VIEW */}
              {activeTab === "users" && selectedUser && (
                <div className="space-y-4">
                  <button onClick={() => setSelectedUser(null)}
                    className="flex items-center gap-2 text-indigo-600 text-sm font-medium hover:text-indigo-700">
                    ← Back to All Users
                  </button>

                  {/* User Profile Card */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                        {selectedUser.full_name?.slice(0, 2).toUpperCase() || "??"}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedUser.full_name || "Unknown"}</h2>
                        <p className="text-gray-500 text-sm">{selectedUser.email}</p>
                        <p className="text-gray-400 text-xs mt-1">🎓 {selectedUser.college || "College not specified"}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1.5 rounded-full font-medium">Active</span>
                        <p className="text-gray-400 text-xs mt-2">Joined {new Date(selectedUser.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                      </div>
                    </div>

                    {/* User Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "Applications", value: getUserApplications(selectedUser.id).length, icon: "📋" },
                        { label: "Readiness", value: `${getUserProgress(selectedUser.id)?.readiness || 0}%`, icon: "🎯" },
                        { label: "Streak", value: `${getUserProgress(selectedUser.id)?.streak || 0} days`, icon: "🔥" },
                      ].map((s, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                          <div className="text-2xl mb-1">{s.icon}</div>
                          <p className="text-xl font-bold text-gray-900">{s.value}</p>
                          <p className="text-xs text-gray-500">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* User Applications */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50">
                      <h3 className="font-semibold text-gray-900 text-sm">Applications ({getUserApplications(selectedUser.id).length})</h3>
                    </div>
                    {getUserApplications(selectedUser.id).length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-sm">No applications yet</div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-50 bg-gray-50/50">
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Company</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Role</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">CTC</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getUserApplications(selectedUser.id).map((app, i) => (
                            <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                              <td className="px-6 py-3 font-medium text-gray-800">{app.company}</td>
                              <td className="px-4 py-3 text-gray-500">{app.role || "—"}</td>
                              <td className="px-4 py-3">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                  app.status === "Offer" ? "bg-emerald-100 text-emerald-700" :
                                  app.status === "Interview" ? "bg-amber-100 text-amber-700" :
                                  app.status === "Rejected" ? "bg-red-100 text-red-700" :
                                  "bg-blue-100 text-blue-700"
                                }`}>{app.status}</span>
                              </td>
                              <td className="px-4 py-3 text-gray-500">{app.ctc || "—"}</td>
                              <td className="px-4 py-3 text-gray-400 text-xs">{app.date || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* User Progress */}
                  {getUserProgress(selectedUser.id) && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h3 className="font-semibold text-gray-900 text-sm mb-4">Progress Data</h3>
                      <div className="space-y-3">
                        {[
                          { label: "Aptitude", value: getUserProgress(selectedUser.id)?.aptitude || 0, max: 100 },
                          { label: "DSA", value: getUserProgress(selectedUser.id)?.dsa || 0, max: 150 },
                          { label: "Technical", value: getUserProgress(selectedUser.id)?.technical || 0, max: 150 },
                          { label: "HR", value: getUserProgress(selectedUser.id)?.hr || 0, max: 100 },
                          { label: "Mock Interviews", value: getUserProgress(selectedUser.id)?.mocks || 0, max: 10 },
                        ].map((p, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">{p.label}</span>
                              <span className="text-gray-500">{p.value}/{p.max}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div className="bg-indigo-500 h-2 rounded-full transition-all"
                                style={{ width: `${(p.value / p.max) * 100}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* APPLICATIONS TAB */}
              {activeTab === "applications" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-50">
                    <h2 className="font-semibold text-gray-900 text-sm">All Applications ({applications.length})</h2>
                  </div>
                  {applications.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">No applications yet</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-50 bg-gray-50/50">
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">User</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Company</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Role</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">CTC</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applications.map((app, i) => {
                            const user = users.find(u => u.id === app.user_id);
                            return (
                              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                <td className="px-6 py-3.5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                                      {user?.full_name?.slice(0, 2).toUpperCase() || "??"}
                                    </div>
                                    <span className="text-gray-700 text-xs">{user?.full_name || "Unknown"}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 font-medium text-gray-800">{app.company}</td>
                                <td className="px-4 py-3.5 text-gray-500">{app.role || "—"}</td>
                                <td className="px-4 py-3.5">
                                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                    app.status === "Offer" ? "bg-emerald-100 text-emerald-700" :
                                    app.status === "Interview" ? "bg-amber-100 text-amber-700" :
                                    app.status === "Rejected" ? "bg-red-100 text-red-700" :
                                    "bg-blue-100 text-blue-700"
                                  }`}>{app.status}</span>
                                </td>
                                <td className="px-4 py-3.5 text-gray-500">{app.ctc || "—"}</td>
                                <td className="px-4 py-3.5 text-gray-400 text-xs">{app.date || "—"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* PROGRESS TAB */}
              {activeTab === "progress" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-50">
                    <h2 className="font-semibold text-gray-900 text-sm">User Progress Data ({progress.length})</h2>
                  </div>
                  {progress.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">No progress data yet</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-50 bg-gray-50/50">
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">User</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Aptitude</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">DSA</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Technical</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">HR</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Mocks</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Readiness</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Streak</th>
                          </tr>
                        </thead>
                        <tbody>
                          {progress.map((p, i) => {
                            const user = users.find(u => u.id === p.user_id);
                            return (
                              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                <td className="px-6 py-3.5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                                      {user?.full_name?.slice(0, 2).toUpperCase() || "??"}
                                    </div>
                                    <div>
                                      <p className="text-gray-700 text-xs font-medium">{user?.full_name || "Unknown"}</p>
                                      <p className="text-gray-400 text-xs">{user?.college || "—"}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 text-center"><span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">{p.aptitude || 0}</span></td>
                                <td className="px-4 py-3.5 text-center"><span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{p.dsa || 0}</span></td>
                                <td className="px-4 py-3.5 text-center"><span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">{p.technical || 0}</span></td>
                                <td className="px-4 py-3.5 text-center"><span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">{p.hr || 0}</span></td>
                                <td className="px-4 py-3.5 text-center"><span className="bg-violet-100 text-violet-700 text-xs px-2 py-1 rounded-full">{p.mocks || 0}</span></td>
                                <td className="px-4 py-3.5 text-center">
                                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${p.readiness >= 70 ? "bg-emerald-100 text-emerald-700" : p.readiness >= 40 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                                    {p.readiness || 0}%
                                  </span>
                                </td>
                                <td className="px-4 py-3.5 text-center"><span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">🔥 {p.streak || 0}</span></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ANALYTICS TAB */}
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
                    <h3 className="font-semibold text-gray-900 mb-4">Application Status Breakdown</h3>
                    {["Applied", "Interview", "Shortlisted", "Offer", "Rejected"].map((status, i) => {
                      const count = applications.filter(a => a.status === status).length;
                      return (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <span className="text-sm text-gray-700">{status}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-100 rounded-full h-1.5">
                              <div className="bg-indigo-500 h-1.5 rounded-full"
                                style={{ width: applications.length > 0 ? `${(count / applications.length) * 100}%` : "0%" }} />
                            </div>
                            <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 col-span-2">
                    <h3 className="font-semibold text-gray-900 mb-4">Platform Overview</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: "Total Users", value: users.length, color: "bg-indigo-500" },
                        { label: "Total Applications", value: applications.length, color: "bg-emerald-500" },
                        { label: "Users with Progress", value: progress.length, color: "bg-amber-500" },
                        { label: "Avg Readiness", value: `${progress.length > 0 ? Math.round(progress.reduce((sum, p) => sum + (p.readiness || 0), 0) / progress.length) : 0}%`, color: "bg-violet-500" },
                      ].map((s, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                          <div className={`w-2 h-2 rounded-full ${s.color} mx-auto mb-2`} />
                          <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                          <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}