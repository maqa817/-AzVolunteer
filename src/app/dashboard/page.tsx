'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  User, Bell, FolderOpen, Award, Atom, TrendingUp,
  CheckCircle, Clock, XCircle, LogOut, ChevronRight,
  Leaf, Zap, ShieldCheck, MapPin, Search, Sparkles, ArrowRight
} from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { dashboardApi, applicationsApi } from '../../lib/api';
import Navbar from '../../components/layout/Navbar';
import { useI18n } from '../../hooks/useI18n';

interface DashboardData {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    isChemicalEngineer?: boolean;
    volunteerProfile?: { city: string; fieldOfStudy: string; university: string };
    chemicalProfile?: { specialization: string };
  };
  applications: Array<{
    id: string;
    status: string;
    project: { id: string; title: string; titleAz?: string; category: string; complexityLevel: string };
  }>;
  projects: Array<{
    id: string;
    title: string;
    titleAz?: string;
    description: string;
    descriptionAz?: string;
    category: string;
    complexityLevel: string;
  }>;
  notifications: Array<{ id: string; title: string; message: string; isRead: boolean; createdAt: string }>;
  certificates: Array<{ id: string; title: string; issuedAt: string }>;
  technicalScore: number | null;
  stats: { totalApplications: number; approvedApplications: number; pendingApplications: number; certificates: number };
  unreadNotifications: number;
}

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const { t, locale } = useI18n();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [applying, setApplying] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/auth/login'); return; }
    fetchDashboard();
  }, [user, authLoading]);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardApi.get();
      setData(res.data.data);
    } catch {
      toast.error(t('dashboard.load_error'));
    } finally {
      setLoading(false);
    }
  };

  const applyToProject = async (projectId: string) => {
    if (data?.profile.status !== 'approved') {
      toast.error(t('dashboard.apply_pending_error'));
      return;
    }
    setApplying(projectId);
    try {
      await applicationsApi.apply(projectId);
      toast.success(t('dashboard.apply_success'));
      fetchDashboard();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || t('dashboard.apply_error');
      toast.error(msg);
    } finally {
      setApplying(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1a0f] flex items-center justify-center p-12">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-green-500/20 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          <Leaf className="absolute inset-0 m-auto text-green-500 animate-pulse" size={20} />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const appliedProjectIds = new Set(data.applications.map((a) => a.project.id));

  const sidebarLinks = [
    { id: 'overview', label: t('dashboard.tabs.overview'), icon: <TrendingUp size={18} /> },
    { id: 'projects', label: t('dashboard.tabs.projects'), icon: <FolderOpen size={18} /> },
    { id: 'applications', label: t('dashboard.tabs.applications'), icon: <CheckCircle size={18} /> },
    { id: 'notifications', label: t('dashboard.tabs.notifications'), icon: <Bell size={18} />, count: data.unreadNotifications },
    { id: 'certificates', label: t('dashboard.tabs.certificates'), icon: <Award size={18} /> },
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'approved') return (
      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_12px_rgba(74,222,128,0.1)]">
        ✅ {t('dashboard.status.approved')}
      </span>
    );
    if (status === 'rejected') return (
      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/20">
        🍁 {t('dashboard.status.rejected')}
      </span>
    );
    return (
      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
        🍂 {t('dashboard.status.pending')}
      </span>
    );
  };

  const ComplexityDots = ({ level }: { level: string }) => {
    const count = level === 'low' ? 1 : level === 'medium' ? 2 : level === 'high' ? 3 : 4;
    return (
      <div className="flex gap-1 items-center">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`w-1 h-1 rounded-full ${i < count ? 'bg-green-400' : 'bg-white/10'}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a1a0f]">
      <Navbar />

      <div className="max-w-[1440px] mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 pb-32">

          {/* Sidebar / Navigation */}
          <aside className="lg:w-[320px] shrink-0">
            <div className="card p-8 bg-[#0f2318] border-white/5 shadow-2xl sticky top-28 rounded-[32px] overflow-hidden group">
              {/* Background Glow */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700" />

              <div className="relative z-10 space-y-8">
                {/* User Profile Summary */}
                <div className="flex flex-col items-center text-center pb-8 border-b border-white/5">
                  <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-green-600 to-lime-500 p-0.5 mb-5 shadow-2xl shadow-green-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <div className="w-full h-full rounded-[26px] bg-emerald-950 flex items-center justify-center text-white font-black text-2xl">
                      {data.profile.firstName[0]}{data.profile.lastName[0]}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">{data.profile.firstName} {data.profile.lastName}</h2>
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-4">{t('dashboard.volunteer_profile')}</p>
                  <StatusBadge status={data.profile.status} />
                </div>

                {/* Nav Links */}
                <nav className="space-y-2">
                  {sidebarLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => setActiveTab(link.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group/nav ${activeTab === link.id
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_20px_rgba(74,222,128,0.05)]'
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`${activeTab === link.id ? 'scale-110' : 'group-hover/nav:translate-x-1'} transition-transform duration-300`}>
                          {link.id === 'overview' && <TrendingUp size={18} />}
                          {link.id === 'projects' && <FolderOpen size={18} />}
                          {link.id === 'applications' && <CheckCircle size={18} />}
                          {link.id === 'notifications' && <Bell size={18} />}
                          {link.id === 'certificates' && <Award size={18} />}
                        </span>
                        <span className="text-xs font-black uppercase tracking-widest">{link.label}</span>
                      </div>
                      {link.count && link.count > 0 && (
                        <span className="w-5 h-5 rounded-full bg-green-500 text-black text-[10px] font-black flex items-center justify-center animate-pulse">
                          {link.count}
                        </span>
                      )}
                      {activeTab === link.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_10px_var(--color-accent-lime)]" />
                      )}
                    </button>
                  ))}
                </nav>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-300 group/out"
                >
                  <LogOut size={18} className="group-hover/out:-translate-x-1 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-widest">{t('nav.logout')}</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 space-y-8 animate-fade-in">

            {/* Context Alert for Pending Users */}
            {data.profile.status === 'pending' && (
              <div className="p-6 rounded-[28px] bg-amber-500/5 border border-amber-500/10 flex items-center gap-5 group">
                <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-500 group-hover:animate-bounce">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">{t('dashboard.verification_in_progress')}</h4>
                  <p className="text-xs text-slate-500 font-medium italic">{t('dashboard.pending_notice')}</p>
                </div>
              </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: t('dashboard.stats.total'), value: data.stats.totalApplications, icon: <FolderOpen size={20} />, color: 'bg-green-500', text: 'text-green-400' },
                { label: t('dashboard.stats.approved'), value: data.stats.approvedApplications, icon: <CheckCircle size={20} />, color: 'bg-lime-500', text: 'text-lime-400' },
                { label: t('dashboard.stats.pending'), value: data.stats.pendingApplications, icon: <Clock size={20} />, color: 'bg-emerald-500', text: 'text-emerald-400' },
                { label: t('dashboard.stats.certificates'), value: data.stats.certificates, icon: <Award size={20} />, color: 'bg-teal-500', text: 'text-teal-400' },
              ].map((stat, i) => (
                <div key={i} className="card p-6 bg-[#0f2318]/60 border-white/5 hover:border-green-500/20 group transition-all duration-500 backdrop-blur-3xl rounded-[28px]">
                  <div className={`w-10 h-10 rounded-xl ${stat.color}/10 flex items-center justify-center ${stat.text} mb-4 group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</div>
                  <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles size={12} className="text-green-400/20" />
                  </div>
                </div>
              ))}
            </div>

            {/* Technical Assessment Score (Organic Gradient Style) */}
            {data.technicalScore !== null && (
              <div className="card p-10 bg-gradient-to-br from-emerald-950/40 to-black/20 border-white/5 rounded-[40px] relative overflow-hidden group">
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[24px] bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20 group-hover:rotate-12 transition-transform duration-500">
                      <Atom size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{t('dashboard.tech_score_title')}</h3>
                      <p className="text-sm text-slate-400 font-medium italic opacity-80 max-w-sm">{t('dashboard.tech_score_desc')}</p>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-300 drop-shadow-2xl">
                      {data.technicalScore}%
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-500/60 justify-center md:justify-end">
                      <Zap size={12} /> {t('dashboard.tech_stem_rank')}
                    </div>
                  </div>
                </div>
                <div className="mt-10 w-full h-2 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-600 via-lime-500 to-emerald-400 shadow-[0_0_15px_rgba(74,222,128,0.3)] transition-all duration-1000"
                    style={{ width: `${data.technicalScore}%` }}
                  />
                </div>
              </div>
            )}

            {/* Main Content Sections */}
            <div className="mt-8">
              {activeTab === 'overview' && (
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Profile Details Card */}
                  <div className="card p-10 border-white/5 bg-[#0f2318]/40 rounded-[40px]">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-green-500 mb-10 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20"><User size={16} /></div>
                      {t('dashboard.profile_title')}
                    </h3>
                    <div className="space-y-6">
                      {[
                        [t('dashboard.full_name'), `${data.profile.firstName} ${data.profile.lastName}`],
                        [t('auth.email'), data.profile.email],
                        [t('auth.city'), data.profile.volunteerProfile?.city || '—'],
                        [t('auth.university'), data.profile.volunteerProfile?.university || '—'],
                        [t('auth.field_of_study'), data.profile.volunteerProfile?.fieldOfStudy || '—'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex flex-col gap-1 border-b border-white/5 pb-4 last:border-0">
                          <dt className="text-[10px] font-black uppercase tracking-widest text-slate-5500 mb-1">{k}</dt>
                          <dd className="text-white font-bold italic opacity-90">{v}</dd>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity / Notifications Preview */}
                  <div className="card p-10 border-white/5 bg-[#0f2318]/40 rounded-[40px]">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-green-500 mb-10 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20"><Bell size={16} /></div>
                      {t('dashboard.recent_notifications')}
                    </h3>
                    <div className="space-y-8">
                      {data.notifications.slice(0, 3).map((n) => (
                        <div key={n.id} className="relative pl-8 group">
                          {/* Timeline Line */}
                          <div className="absolute left-0 top-0 bottom-[-32px] w-0.5 bg-green-500/10 group-last:hidden" />
                          <div className="absolute left-[-3px] top-1.5 w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />

                          <div className="font-bold text-white mb-1 text-sm">{n.title}</div>
                          <div className="text-xs text-slate-500 font-medium italic line-clamp-2 mb-2">{n.message}</div>
                          <div className="text-[9px] font-black uppercase tracking-widest text-slate-700">{new Date(n.createdAt).toLocaleDateString()}</div>
                        </div>
                      ))}
                      {data.notifications.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 opacity-30 italic">
                          <Bell size={32} className="mb-4" />
                          <p className="text-sm font-medium">{t('dashboard.no_activity')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="grid md:grid-cols-2 gap-8">
                  {data.projects.length === 0 && (
                    <div className="col-span-2 text-center py-32 card border-dashed border-white/10 bg-transparent rounded-[40px]">
                      <Leaf size={48} className="mx-auto mb-6 text-green-900/40" />
                      <p className="text-slate-500 font-bold italic">{t('dashboard.no_projects')}</p>
                    </div>
                  )}
                  {data.projects.map((project) => {
                    const applied = appliedProjectIds.has(project.id);
                    return (
                      <div key={project.id} className="card p-8 bg-[#132b1a] hover:bg-[#1a3d22] transition-colors duration-500 border-white/5 rounded-[32px] flex flex-col group shadow-2xl">
                        <div className="flex justify-between items-start mb-6">
                          <div className="text-[10px] font-black uppercase tracking-widest text-green-500/60 bg-green-500/5 px-2 py-1 rounded-md">
                            {t(`projects.categories.${project.category.toLowerCase()}`) || project.category}
                          </div>
                          <ComplexityDots level={project.complexityLevel} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-green-400 transition-colors">
                          {(locale === 'az' && project.titleAz) ? project.titleAz : project.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium italic opacity-70 line-clamp-2 mb-8 leading-relaxed">
                          {(locale === 'az' && project.descriptionAz) ? project.descriptionAz : project.description}
                        </p>
                        <button
                          onClick={() => !applied && applyToProject(project.id)}
                          disabled={applied || applying === project.id}
                          className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${applied
                            ? 'bg-green-500/5 text-green-400 border border-green-500/10 cursor-default'
                            : 'btn-primary'
                            }`}
                        >
                          {applying === project.id ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              {t('dashboard.projects.applying_btn')}
                            </span>
                          ) : applied ? (
                            <span className="flex items-center justify-center gap-2">
                              <ShieldCheck size={14} className="text-green-400 animate-pulse" />
                              {t('dashboard.projects.applied_btn')}
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              {t('dashboard.projects.join_project')} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'applications' && (
                <div className="space-y-6">
                  {data.applications.length === 0 && (
                    <div className="text-center py-32 card border-dashed border-white/10 bg-transparent rounded-[40px]">
                      <CheckCircle size={48} className="mx-auto mb-6 text-green-900/40" />
                      <p className="text-slate-500 font-bold italic">{t('dashboard.no_applications')}</p>
                    </div>
                  )}
                  {data.applications.map((app) => (
                    <div key={app.id} className="card p-8 bg-[#0f2318]/80 border-white/5 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-[#132b1a] transition-all">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-6 h-6 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20 group-hover:rotate-12 transition-transform">
                            <Leaf size={12} />
                          </div>
                          <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">
                            {t(`projects.categories.${app.project.category.toLowerCase()}`) || app.project.category}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-green-400 transition-colors">
                          {(locale === 'az' && app.project.titleAz) ? app.project.titleAz : app.project.title}
                        </h4>
                        <div className="flex items-center gap-4">
                          <ComplexityDots level={app.project.complexityLevel} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{t('dashboard.project_reference')}: {app.id.slice(0, 8)}</span>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-8">
                        <div className="h-10 w-px bg-white/5 hidden md:block" />
                        <StatusBadge status={app.status} />
                        <ChevronRight className="text-slate-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all transition-opacity" size={20} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  {data.notifications.length === 0 && (
                    <div className="text-center py-32 card border-dashed border-white/10 bg-transparent rounded-[40px]">
                      <Bell size={48} className="mx-auto mb-6 text-green-900/40" />
                      <p className="text-slate-500 font-bold italic">{t('dashboard.no_notifications')}</p>
                    </div>
                  )}
                  {data.notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`card p-8 rounded-[32px] transition-all duration-300 group border-white/5 ${!notif.isRead ? 'bg-green-500/5 shadow-[0_0_30px_rgba(74,222,128,0.05)] border-green-500/10' : 'bg-[#0f2318]/60'
                        }`}
                    >
                      <div className="flex justify-between items-start gap-8">
                        <div className="flex gap-6">
                          <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110 ${!notif.isRead ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-white/5 text-slate-500 border-white/5'
                            }`}>
                            <Bell size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-white text-lg flex items-center gap-3 mb-2">
                              {!notif.isRead && (
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                                </span>
                              )}
                              {notif.title}
                            </div>
                            <p className="text-sm text-slate-400 font-medium italic opacity-80 leading-relaxed max-w-2xl">{notif.message}</p>
                          </div>
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-700 pt-2 shrink-0">
                          {new Date(notif.createdAt).toLocaleDateString('az-AZ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'certificates' && (
                <div className="grid md:grid-cols-2 gap-8">
                  {data.certificates.length === 0 && (
                    <div className="col-span-2 text-center py-32 card border-dashed border-white/10 bg-transparent rounded-[40px]">
                      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5 opacity-40">
                        <Award size={48} className="text-slate-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">{t('dashboard.no_certificates')}</h4>
                      <p className="text-slate-500 font-medium italic">{t('dashboard.complete_for_legacy')}</p>
                    </div>
                  )}
                  {data.certificates.map((cert) => (
                    <div key={cert.id} className="card p-10 bg-[#0f2318]/80 hover:bg-[#132b1a] border-white/5 rounded-[40px] flex items-center gap-10 group transition-all duration-500 shadow-2xl overflow-hidden shadow-black/40">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-[50px] rounded-full group-hover:bg-yellow-500/10 transition-colors" />

                      <div className="shrink-0 w-20 h-20 rounded-[28px] bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-white shadow-2xl shadow-yellow-500/20 group-hover:rotate-12 transition-all duration-500">
                        <Award size={40} className="fill-white/20" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-yellow-400 transition-colors">{cert.title}</h4>
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-r border-white/10 pr-4">
                            ID: {cert.id.slice(0, 12)}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-green-500">
                          {t('dashboard.issued')}: {new Date(cert.issuedAt).toLocaleDateString(locale === 'az' ? 'az-AZ' : 'en-US')}
                        </span>
                      </div>
                      <button className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                        {t('dashboard.download_pdf')} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </button>
                    </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .shadow-3xl {
          box-shadow: 0 32px 64px -16px rgba(0, 0, 0, 0.4);
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
