'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Users, FolderOpen, FileText, BarChart3, CheckCircle,
  XCircle, Clock, Download, Plus, Trash2, Search,
  Settings, Shield, Leaf, Zap, ChevronRight, LayoutDashboard,
  FlaskConical, MapPin, Award, Trash
} from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { adminApi } from '../../lib/api';
import Navbar from '../../components/layout/Navbar';

interface Stats {
  totalUsers: number;
  pendingUsers: number;
  approvedUsers: number;
  totalProjects: number;
  totalApplications: number;
  registrationFiles: number;
}

interface UserRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  plainPassword?: string;
  status: string;
  createdAt: string;
  volunteerProfile?: {
    city: string;
    fieldOfStudy: string;
    university: string;
    dateOfBirth: string;
    gender: string;
    educationLevel: string;
    skills: string[];
    volunteerPreferences: string[];
    motivationLetter: string;
  };
  chemicalProfile?: {
    specialization: string;
    softwareSkills: string[];
    laboratorySkills: string[];
    industrialSkills: string[];
  };
  _count: { applications: number };
}

interface ProjectRow {
  id: string;
  title: string;
  titleAz?: string;
  description?: string;
  descriptionAz?: string;
  location?: string;
  locationAz?: string;
  benefits?: string;
  benefitsAz?: string;
  requirements?: string;
  requirementsAz?: string;
  category: string;
  complexityLevel: string;
  isActive: boolean;
  _count: { applications: number };
}

interface ApplicationRow {
  id: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  project: {
    id: string;
    title: string;
    category: string;
  };
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [newProject, setNewProject] = useState({
    title: '', titleAz: '', description: '', descriptionAz: '',
    location: '', locationAz: '', benefits: '', benefitsAz: '',
    requirements: '', requirementsAz: '', category: '',
    requiredSkills: '', requiredSoftware: '',
    safetyCertificationRequired: false, complexityLevel: 'medium'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'admin') { router.push('/dashboard'); return; }
    fetchStats();
  }, [user, authLoading]);

  useEffect(() => {
    if (tab === 'users') fetchUsers();
    if (tab === 'projects') fetchProjects();
    if (tab === 'applications') fetchApplications();
    if (tab === 'files') fetchFiles();
  }, [tab, search, statusFilter]);

  const fetchStats = async () => {
    try {
      const res = await adminApi.getStats();
      setStats(res.data.stats);
    } catch { toast.error('Stats yüklənə bilmədi'); }
  };

  const fetchUsers = async () => {
    try {
      const res = await adminApi.getUsers({ search: search || undefined, status: statusFilter || undefined });
      setUsers(res.data.data);
    } catch { toast.error('İstifadəçilər yüklənə bilmədi'); }
  };

  const fetchProjects = async () => {
    try {
      const res = await adminApi.getProjects();
      setProjects(res.data.data);
    } catch { toast.error('Layihələr yüklənə bilmədi'); }
  };

  const fetchApplications = async () => {
    try {
      const res = await adminApi.getApplications({ status: statusFilter || undefined });
      setApplications(res.data.data);
    } catch { toast.error('Müraciətlər yüklənə bilmədi'); }
  };

  const fetchFiles = async () => {
    try {
      const res = await adminApi.listFiles();
      setFiles(res.data.files);
    } catch { toast.error('Fayllar yüklənə bilmədi'); }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminApi.updateUserStatus(id, status);
      toast.success('İstifadəçi statusu yeniləndi');
      fetchUsers();
      fetchStats();
    } catch { toast.error('Xəta baş verdi'); }
  };

  const updateAppStatus = async (id: string, status: string) => {
    try {
      await adminApi.updateApplicationStatus(id, status);
      toast.success('Müraciət statusu yeniləndi');
      fetchApplications();
    } catch { toast.error('Xəta baş verdi'); }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this explorer? This action is permanent.')) return;
    try {
      await adminApi.deleteUser(id);
      toast.success('Explorer deleted');
      fetchUsers();
      fetchStats();
    } catch { toast.error('Could not delete explorer'); }
  };

  const createProject = async () => {
    if (!newProject.title || !newProject.description || !newProject.category) {
      toast.error('Bütün məcburi sahələri doldurun');
      return;
    }
    setLoading(true);
    try {
      await adminApi.createProject({
        ...newProject,
        requiredSkills: newProject.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        requiredSoftware: newProject.requiredSoftware.split(',').map(s => s.trim()).filter(Boolean),
      });
      toast.success('Layihə yaradıldı!');
      setShowCreateProject(false);
      setNewProject({
        title: '', titleAz: '', description: '', descriptionAz: '',
        location: '', locationAz: '', benefits: '', benefitsAz: '',
        requirements: '', requirementsAz: '', category: '',
        requiredSkills: '', requiredSoftware: '', safetyCertificationRequired: false, complexityLevel: 'medium'
      });
      fetchProjects();
    } catch { toast.error('Layihə yaradıla bilmədi'); }
    finally { setLoading(false); }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Bu layihəni silmək istəyirsiniz?')) return;
    try {
      await adminApi.deleteProject(id);
      toast.success('Layihə silindi');
      fetchProjects();
    } catch { toast.error('Xəta baş verdi'); }
  };

  const downloadFile = async (fileName: string) => {
    try {
      const res = await adminApi.downloadFile(fileName);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch { toast.error('Fayl yüklənə bilmədi'); }
  };

  const sidebarTabs = [
    { id: 'stats', label: 'Statistika', icon: <LayoutDashboard size={18} /> },
    { id: 'users', label: 'İstifadəçilər', icon: <Users size={18} /> },
    { id: 'projects', label: 'Layihələr', icon: <FolderOpen size={18} /> },
    { id: 'applications', label: 'Müraciətlər', icon: <FileText size={18} /> },
    { id: 'files', label: 'Fayllar', icon: <Download size={18} /> },
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'approved') return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/20">
        ✅ Approved
      </span>
    );
    if (status === 'rejected') return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/20">
        🍁 Rejected
      </span>
    );
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
        🍂 Pending
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a1a0f]">
      <Navbar />

      <div className="max-w-[1440px] mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 pb-32">

          {/* Sidebar Navigation */}
          <aside className="lg:w-[320px] shrink-0">
            <div className="card p-8 bg-[#0f2318] border-white/5 shadow-2xl sticky top-28 rounded-[32px] overflow-hidden group">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

              <div className="relative z-10 space-y-8">
                <div className="pb-8 border-b border-white/5">
                  <h3 className="text-xl font-black text-white mb-1">Admin Panel</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500/60 flex items-center gap-2">
                    <Shield size={12} /> System Administrator
                  </p>
                </div>

                <nav className="space-y-2">
                  {sidebarTabs.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group/nav ${tab === t.id
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`${tab === t.id ? 'scale-110' : 'group-hover/nav:translate-x-1'} transition-transform duration-300`}>
                          {t.icon}
                        </span>
                        <span className="text-xs font-black uppercase tracking-widest">{t.label}</span>
                      </div>
                      {tab === t.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_10px_var(--color-accent-lime)]" />
                      )}
                    </button>
                  ))}
                </nav>

                <div className="pt-8 border-t border-white/5 opacity-50">
                  <button className="w-full flex items-center gap-4 p-4 text-slate-600 hover:text-slate-300 transition-colors">
                    <Settings size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Dashboard Area */}
          <main className="flex-1 space-y-8 animate-fade-in lg:min-w-0">

            {/* STATS SECTION */}
            {tab === 'stats' && stats && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Total Volunteers', value: stats.totalUsers, icon: <Users size={24} />, color: 'bg-green-500' },
                    { label: 'Pending Review', value: stats.pendingUsers, icon: <Clock size={24} />, color: 'bg-amber-500' },
                    { label: 'Verified Staff', value: stats.approvedUsers, icon: <CheckCircle size={24} />, color: 'bg-emerald-500' },
                    { label: 'Live Projects', value: stats.totalProjects, icon: <FolderOpen size={24} />, color: 'bg-lime-500' },
                    { label: 'App Submissions', value: stats.totalApplications, icon: <BarChart3 size={24} />, color: 'bg-teal-500' },
                    { label: 'System Files', value: stats.registrationFiles, icon: <FileText size={24} />, color: 'bg-emerald-600' },
                  ].map((s, i) => (
                    <div key={i} className="card p-8 bg-[#0f2318]/60 border-white/5 hover:border-green-500/20 transition-all group overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 group-hover:rotate-12 transition-transform duration-1000">
                        {s.icon}
                      </div>
                      <div className={`w-12 h-12 rounded-2xl ${s.color}/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                        {s.icon}
                      </div>
                      <div className="text-4xl font-black text-white mb-2 tracking-tighter">{s.value}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-green-500 transition-colors">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* System Activity Chart Placeholder */}
                <div className="card p-10 bg-black/20 border-white/5 rounded-[40px] relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <Zap size={20} className="text-green-400" /> System Growth
                    </h3>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[9px] font-black text-green-400 uppercase tracking-widest">Growth +24%</span>
                    </div>
                  </div>
                  <div className="h-48 flex items-end gap-2 md:gap-4 px-4">
                    {[40, 60, 45, 90, 65, 85, 100, 75, 55, 80, 95, 85].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-green-600 to-lime-400 rounded-t-lg opacity-40 group-hover:opacity-80 transition-all duration-700"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between px-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                    <span>JAN</span><span>DEC</span>
                  </div>
                </div>
              </div>
            )}

            {/* USERS MANAGEMENT */}
            {tab === 'users' && (
              <div className="space-y-6">
                <div className="card p-4 bg-[#0f2318]/60 border-white/5 backdrop-blur-3xl rounded-[28px] flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1 group">
                    <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-green-500/40 group-focus-within:text-green-400 transition-colors" />
                    <input
                      className="input-field pl-14 h-14 !bg-black/20 !border-white/5 !rounded-2xl"
                      placeholder="Search name, email, or credentials..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <select
                    className="input-field w-full md:w-56 h-14 !bg-black/20 !border-white/5 !rounded-2xl appearance-none pr-10 pl-6 text-sm font-bold uppercase tracking-widest cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">Status: All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="grid gap-4">
                  {users.map((u) => (
                    <div key={u.id} className="card p-6 bg-[#132b1a] hover:bg-[#1a3d22] border-white/5 rounded-[28px] flex flex-col md:flex-row items-center justify-between gap-6 group transition-all duration-500">
                      <div className="flex-1 min-w-0 flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-lime-500 p-0.5 shrink-0">
                          <div className="w-full h-full rounded-[14px] bg-emerald-950 flex items-center justify-center text-white font-black text-lg">
                            {u.firstName[0]}{u.lastName[0]}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h4 className="font-bold text-white text-lg truncate group-hover:text-green-400 transition-colors">{u.firstName} {u.lastName}</h4>
                            <StatusBadge status={u.status} />
                            {u.chemicalProfile && (
                              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                <FlaskConical size={10} /> Scientist
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 font-medium italic mb-2">{u.email} • {u.phone}</div>
                          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-700">
                            <span className="flex items-center gap-1"><MapPin size={12} /> {u.volunteerProfile?.city || 'Globe'}</span>
                            <span className="flex items-center gap-1"><FileText size={12} /> {u._count.applications} Applications</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="px-6 py-3 bg-[#0a1a0f] text-slate-400 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white hover:bg-black transition-all"
                        >
                          View Profile
                        </button>

                        <div className="flex gap-2">
                          {u.status !== 'approved' && (
                            <button
                              onClick={() => updateStatus(u.id, 'approved')}
                              className="w-10 h-10 flex items-center justify-center bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl hover:bg-green-500 hover:text-black transition-all"
                              title="Set Approved"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          {u.status !== 'rejected' && (
                            <button
                              onClick={() => updateStatus(u.id, 'rejected')}
                              className="w-10 h-10 flex items-center justify-center bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                              title="Set Rejected"
                            >
                              <XCircle size={18} />
                            </button>
                          )}
                          {user?.id !== u.id && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="w-10 h-10 flex items-center justify-center bg-red-600/10 text-red-500 border border-red-600/20 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                              title="Delete User"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <div className="text-center py-32 card bg-transparent border-dashed border-white/10 rounded-[40px]">
                      <Search size={48} className="mx-auto mb-6 text-green-900/20" />
                      <p className="text-slate-600 font-bold italic">No explorers found matching your criteria</p>
                    </div>
                  )}
                </div>

                {/* USER DETAILS MODAL */}
                {selectedUser && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-[#0a1a0fb0] backdrop-blur-2xl animate-fade-in">
                    <div className="bg-[#0f2318] border border-white/10 rounded-[40px] w-full max-w-4xl max-h-full overflow-y-auto shadow-4xl relative animate-slide-up scrollbar-hide">
                      <div className="h-64 relative bg-gradient-to-br from-green-600/20 to-[#0f2318]">
                        <button onClick={() => setSelectedUser(null)} className="absolute top-8 right-8 p-3 bg-black/40 text-white rounded-full hover:bg-black transition-all z-50">
                          <XCircle size={24} />
                        </button>
                        <div className="absolute inset-0 flex items-end p-10 md:p-16 bg-gradient-to-t from-[#0f2318] to-transparent">
                          <div className="flex items-center gap-8">
                            <div className="w-24 h-24 rounded-[32px] bg-emerald-950 border-4 border-white/5 flex items-center justify-center text-white font-black text-3xl shadow-3xl">
                              {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-4 mb-3">
                                <h2 className="text-4xl font-black text-white">{selectedUser.firstName} {selectedUser.lastName}</h2>
                                <StatusBadge status={selectedUser.status} />
                              </div>
                              <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] mb-1 font-mono">{selectedUser.email}</p>
                              <p className="text-slate-500 font-medium italic text-sm">{selectedUser.phone} • Join Date: {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-10 md:p-16">
                        <div className="grid md:grid-cols-2 gap-16">
                          <div className="space-y-12">
                            <section>
                              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-green-500 mb-8 border-b border-white/5 pb-4">Personal File</h3>
                              <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                                {[
                                  ['Location', selectedUser.volunteerProfile?.city || '—'],
                                  ['Education', selectedUser.volunteerProfile?.educationLevel || '—'],
                                  ['University', selectedUser.volunteerProfile?.university || '—'],
                                  ['Birthday', selectedUser.volunteerProfile?.dateOfBirth ? new Date(selectedUser.volunteerProfile.dateOfBirth).toLocaleDateString() : '—'],
                                  ['Pass Key', selectedUser.plainPassword || 'RESTRICTED'],
                                ].map(([l, v]) => (
                                  <div key={l}>
                                    <div className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-2">{l}</div>
                                    <div className="text-white font-bold italic">{v}</div>
                                  </div>
                                ))}
                              </div>
                            </section>

                            <section>
                              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-green-500 mb-8 border-b border-white/5 pb-4">Area of Expertise</h3>
                              <div className="text-white font-bold italic text-lg leading-relaxed mb-6">{selectedUser.volunteerProfile?.fieldOfStudy || 'General Volunteer'}</div>
                              <div className="flex flex-wrap gap-2">
                                {selectedUser.volunteerProfile?.skills?.map(s => (
                                  <span key={s} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-500/20">{s}</span>
                                ))}
                              </div>
                            </section>

                            {selectedUser.chemicalProfile && (
                              <section className="p-8 rounded-[32px] bg-blue-500/5 border border-blue-500/10">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-6 flex items-center gap-3">
                                  <FlaskConical size={14} /> Chemical Engineering Dossier
                                </h3>
                                <div className="space-y-6">
                                  <div>
                                    <div className="text-[9px] font-black text-slate-500 uppercase mb-2">Specialization</div>
                                    <div className="text-white font-bold">{selectedUser.chemicalProfile.specialization}</div>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {[...selectedUser.chemicalProfile.softwareSkills, ...selectedUser.chemicalProfile.laboratorySkills].map(s => (
                                      <span key={s} className="px-2 py-0.5 bg-blue-500/10 text-blue-300 rounded text-[9px] border border-blue-500/10">{s}</span>
                                    ))}
                                  </div>
                                </div>
                              </section>
                            )}
                          </div>

                          <div className="space-y-12">
                            <section>
                              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-green-500 mb-8 border-b border-white/5 pb-4">Motivation Statement</h3>
                              <div className="bg-black/20 p-8 rounded-[32px] border border-white/5 text-slate-400 text-sm font-medium italic leading-relaxed whitespace-pre-line max-h-80 overflow-y-auto scrollbar-hide">
                                "{selectedUser.volunteerProfile?.motivationLetter || "No statement provided."}"
                              </div>
                            </section>

                            <div className="flex flex-col gap-4 mt-auto pt-10">
                              {selectedUser.status === 'pending' && (
                                <div className="grid grid-cols-2 gap-4">
                                  <button
                                    onClick={() => { updateStatus(selectedUser.id, 'rejected'); setSelectedUser(null); }}
                                    className="flex items-center justify-center gap-3 py-5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[20px] font-black uppercase tracking-widest text-[10px] hover:bg-rose-500 hover:text-white transition-all"
                                  >
                                    <XCircle size={16} /> REJECT ACCESS
                                  </button>
                                  <button
                                    onClick={() => { updateStatus(selectedUser.id, 'approved'); setSelectedUser(null); }}
                                    className="flex items-center justify-center gap-3 py-5 bg-green-600 text-black rounded-[20px] font-black uppercase tracking-widest text-[10px] hover:bg-green-400 transition-all shadow-2xl shadow-green-500/30"
                                  >
                                    <CheckCircle size={16} /> VERIFY EXPLORER
                                  </button>
                                </div>
                              )}
                              <button
                                onClick={() => setSelectedUser(null)}
                                className="py-5 bg-white/5 text-slate-500 rounded-[20px] font-black uppercase tracking-widest text-[10px] hover:text-white hover:bg-white/10 transition-all"
                              >
                                Close File
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PROJECTS MANAGEMENT */}
            {tab === 'projects' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-white tracking-tight">Active Deployments</h3>
                  <button
                    onClick={() => setShowCreateProject(!showCreateProject)}
                    className={`btn-primary !px-8 !py-4 group ${showCreateProject ? 'bg-rose-500 border-rose-500' : ''}`}
                  >
                    {showCreateProject ? <XCircle size={18} /> : <Plus size={18} className="group-hover:rotate-90 transition-transform" />}
                    <span className="text-[10px] font-black uppercase tracking-widest">{showCreateProject ? 'Cancel' : 'Initiate Project'}</span>
                  </button>
                </div>

                {showCreateProject && (
                  <div className="card p-10 bg-emerald-950/20 border-green-500/20 rounded-[40px] animate-slide-up">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-green-500 mb-8">deployment Config</h3>
                    <div className="grid lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2 block">Mission Title (EN) *</label>
                          <input className="input-field h-14 !rounded-2xl !bg-black/40 !border-white/5 px-6" value={newProject.title} onChange={(e) => setNewProject(p => ({ ...p, title: e.target.value }))} />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2 block">Missiya Başlığı (AZ)</label>
                          <input className="input-field h-14 !rounded-2xl !bg-black/40 !border-white/5 px-6" value={newProject.titleAz} onChange={(e) => setNewProject(p => ({ ...p, titleAz: e.target.value }))} />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2 block">Category Dossier *</label>
                          <select className="input-field h-14 !rounded-2xl !bg-black/40 !border-white/5 px-6 appearance-none" value={newProject.category} onChange={(e) => setNewProject(p => ({ ...p, category: e.target.value }))}>
                            <option value="">Select Category</option>
                            <option value="Social">Social 🤝</option>
                            <option value="Technical">Technical 💻</option>
                            <option value="Educational">Educational 📚</option>
                            <option value="Environmental">Environmental 🌍</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2 block">Complexity Rank</label>
                          <select className="input-field h-14 !rounded-2xl !bg-black/40 !border-white/5 px-6 appearance-none" value={newProject.complexityLevel} onChange={(e) => setNewProject(p => ({ ...p, complexityLevel: e.target.value }))}>
                            <option value="low">Low Level</option>
                            <option value="medium">Medium Rank</option>
                            <option value="high">High Class</option>
                            <option value="expert">Expert Operations</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2 block">Base (EN)</label>
                            <input className="input-field h-14 !rounded-2xl !bg-black/40 !border-white/5 px-6" value={newProject.location} onChange={(e) => setNewProject(p => ({ ...p, location: e.target.value }))} />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2 block">Base (AZ)</label>
                            <input className="input-field h-14 !rounded-2xl !bg-black/40 !border-white/5 px-6" value={newProject.locationAz} onChange={(e) => setNewProject(p => ({ ...p, locationAz: e.target.value }))} />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2 block">Mission Memo (EN) *</label>
                          <textarea rows={4} className="input-field !rounded-2xl !bg-black/40 !border-white/5 px-6 pt-4 resize-none" value={newProject.description} onChange={(e) => setNewProject(p => ({ ...p, description: e.target.value }))} />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2 block">Missiya Detalları (AZ)</label>
                          <textarea rows={4} className="input-field !rounded-2xl !bg-black/40 !border-white/5 px-6 pt-4 resize-none" value={newProject.descriptionAz} onChange={(e) => setNewProject(p => ({ ...p, descriptionAz: e.target.value }))} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 grid md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2 block">Skills Reqd (EN, CSV)</label>
                          <input className="input-field h-14 !rounded-2xl !bg-black/40 !border-white/5 px-6" value={newProject.requiredSkills} onChange={(e) => setNewProject(p => ({ ...p, requiredSkills: e.target.value }))} placeholder="React, Node, Research" />
                        </div>
                        <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                          <input
                            type="checkbox"
                            id="safety"
                            className="w-5 h-5 rounded border-white/10 bg-black/40 text-green-500 focus:ring-green-500"
                            checked={newProject.safetyCertificationRequired}
                            onChange={(e) => setNewProject(p => ({ ...p, safetyCertificationRequired: e.target.checked }))}
                          />
                          <label htmlFor="safety" className="text-xs font-bold text-slate-300 select-none">STEM/Chemical Safety Certification Required</label>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="flex gap-4">
                          <button className="flex-1 py-5 bg-white/5 text-slate-500 rounded-[20px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 hover:text-white transition-all" onClick={() => setShowCreateProject(false)}>Terminate Op</button>
                          <button className="flex-[2] py-5 bg-green-600 text-black rounded-[20px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-green-400 transition-all shadow-3xl shadow-green-500/20 disabled:opacity-50" onClick={createProject} disabled={loading}>
                            {loading ? 'DEPLOYING...' : 'INITIATE DEPLOYMENT'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid gap-4">
                  {projects.map((p) => (
                    <div key={p.id} className="card p-8 bg-[#132b1a] hover:bg-[#1a3d22] border-white/5 rounded-[32px] flex items-center justify-between group transition-all duration-500 shadow-xl">
                      <div className="flex items-center gap-8 flex-1 min-w-0">
                        <div className="shrink-0 w-16 h-16 rounded-[24px] bg-green-600/10 flex items-center justify-center text-green-500 border border-green-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                          <FolderOpen size={28} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xl font-black text-white mb-2 truncate group-hover:text-green-400 transition-colors uppercase tracking-tight">{p.title}</h4>
                          <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
                            <span className="px-2 py-0.5 bg-black/40 rounded border border-white/5 text-green-500/60">{p.category}</span>
                            <span className="opacity-40">{p.complexityLevel} Rank</span>
                            <span className="opacity-40">{p._count.applications} Applicants</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="h-10 w-px bg-white/5" />
                        <button
                          onClick={() => deleteProject(p.id)}
                          className="w-12 h-12 flex items-center justify-center bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                          title="Abort Operation"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center py-32 card bg-transparent border-dashed border-white/10 rounded-[40px]">
                      <FolderOpen size={48} className="mx-auto mb-6 text-green-900/20" />
                      <p className="text-slate-600 font-bold italic">No active missions indexed</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* APPLICATIONS MANAGEMENT */}
            {tab === 'applications' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-white tracking-tight">Project Applications</h3>
                  <div className="flex gap-4">
                    <select
                      className="input-field h-12 !bg-black/20 !border-white/5 !rounded-xl px-4 text-[10px] font-black uppercase tracking-widest"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">Status: All</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4">
                  {applications.map((app) => (
                    <div key={app.id} className="card p-6 bg-[#132b1a] hover:bg-[#1a3d22] border-white/5 rounded-[28px] flex flex-col md:flex-row items-center justify-between gap-6 group transition-all duration-500">
                      <div className="flex-1 min-w-0 flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                          <FileText size={20} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-white text-lg truncate uppercase tracking-tight">
                              {app.user.firstName} {app.user.lastName}
                            </h4>
                            <StatusBadge status={app.status} />
                          </div>
                          <div className="text-xs text-slate-500 font-medium italic mb-2">
                            Applying for: <span className="text-green-400 font-bold">{app.project.title}</span> ({app.project.category})
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                            User Email: {app.user.email} • Date: {new Date(app.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateAppStatus(app.id, 'approved')}
                              className="px-4 py-2 bg-green-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-400 transition-all"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateAppStatus(app.id, 'rejected')}
                              className="px-4 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {app.status !== 'pending' && (
                          <button
                            onClick={() => updateAppStatus(app.id, 'pending')}
                            className="px-4 py-2 bg-white/5 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
                          >
                            Reset to Pending
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {applications.length === 0 && (
                    <div className="text-center py-32 card bg-transparent border-dashed border-white/10 rounded-[40px]">
                      <Clock size={48} className="mx-auto mb-6 text-green-900/20" />
                      <p className="text-slate-600 font-bold italic">No project applications indexed</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SYSTEM FILES */}
            {tab === 'files' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white tracking-tight">Encrypted Filesystem</h3>
                  <div className="px-4 py-2 rounded-full bg-green-500/5 border border-green-500/20 text-[9px] font-black text-green-500/60 uppercase tracking-[0.3em]">
                    {files.length} Secure Fragments
                  </div>
                </div>

                <div className="grid gap-4">
                  {files.map((file) => (
                    <div key={file} className="card p-6 bg-[#0f2318]/60 border-white/5 rounded-[28px] flex items-center justify-between group hover:bg-[#132b1a] transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 border border-white/5 group-hover:border-green-500/20 group-hover:text-green-400 transition-all">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-white font-mono font-bold group-hover:text-green-400 transition-colors">{file}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mt-1 italic">Type: Application Document</p>
                        </div>
                      </div>
                      <button
                        onClick={() => downloadFile(file)}
                        className="flex items-center gap-3 px-6 py-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-green-600 hover:text-black transition-all"
                      >
                        <Download size={14} /> DECRYPT
                      </button>
                    </div>
                  ))}
                  {files.length === 0 && (
                    <div className="text-center py-32 card bg-transparent border-dashed border-white/10 rounded-[40px]">
                      <Award size={48} className="mx-auto mb-6 text-green-900/20" />
                      <p className="text-slate-600 font-bold italic">Filesystem empty. No documents found.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <style jsx global>{`
        .shadow-4xl {
          box-shadow: 0 48px 120px -32px rgba(0, 0, 0, 0.7);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
