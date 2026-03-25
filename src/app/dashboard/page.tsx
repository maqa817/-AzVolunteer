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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-12">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-emerald-500/20 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <Leaf className="absolute inset-0 m-auto text-emerald-500 animate-pulse" size={20} />
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
      <span className="badge-approved">
        ✅ {t('dashboard.status.approved')}
      </span>
    );
    if (status === 'rejected') return (
      <span className="badge-rejected">
        🍁 {t('dashboard.status.rejected')}
      </span>
    );
    return (
      <span className="badge-pending">
        🍂 {t('dashboard.status.pending')}
      </span>
    );
  };

  const ComplexityDots = ({ level }: { level: string }) => {
    const count = level === 'low' ? 1 : level === 'medium' ? 2 : level === 'high' ? 3 : 4;
    return (
      <div className="flex gap-1 items-center">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < count ? 'bg-emerald-500' : 'bg-slate-200'}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 pb-32">

          {/* Sidebar / Navigation */}
          <aside className="lg:w-[320px] shrink-0">
            <div className="card !p-8 sticky top-28 group content-start h-max">
              {/* Background Glow */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700" />

              <div className="relative z-10 space-y-8">
                {/* User Profile Summary */}
                <div className="flex flex-col items-center text-center pb-8 border-b border-slate-100">
                  <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 mb-5 shadow-lg shadow-emerald-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <div className="w-full h-full rounded-[26px] bg-white flex items-center justify-center text-emerald-600 font-black text-2xl">
                      {data.profile.firstName[0]}{data.profile.lastName[0]}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">{data.profile.firstName} {data.profile.lastName}</h2>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-4">{t('dashboard.volunteer_profile')}</p>
                  <StatusBadge status={data.profile.status} />
                </div>

                {/* Nav Links */}
                <nav className="space-y-2">
                  {sidebarLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => setActiveTab(link.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group/nav ${activeTab === link.id
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm'
                        : 'text-slate-500 hover:text-emerald-600 hover:bg-slate-50'
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
                        <span className="text-xs font-bold uppercase tracking-widest">{link.label}</span>
                      </div>
                      {link.count && link.count > 0 && (
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {link.count}
                        </span>
                      )}
                      {activeTab === link.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
                      )}
                    </button>
                  ))}
                </nav>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300 group/out"
                >
                  <LogOut size={18} className="group-hover/out:-translate-x-1 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-widest">{t('nav.logout')}</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 space-y-8 animate-fade-in">

            {/* Context Alert for Pending Users */}
            {data.profile.status === 'pending' && (
              <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-5 group">
                <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 group-hover:scale-110 transition-transform">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold text-sm mb-1">{t('dashboard.verification_in_progress')}</h4>
                  <p className="text-xs text-slate-600">{t('dashboard.pending_notice')}</p>
                </div>
              </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: t('dashboard.stats.total'), value: data.stats.totalApplications, icon: <FolderOpen size={20} />, color: 'bg-emerald-50', text: 'text-emerald-600' },
                { label: t('dashboard.stats.approved'), value: data.stats.approvedApplications, icon: <CheckCircle size={20} />, color: 'bg-teal-50', text: 'text-teal-600' },
                { label: t('dashboard.stats.pending'), value: data.stats.pendingApplications, icon: <Clock size={20} />, color: 'bg-amber-50', text: 'text-amber-600' },
                { label: t('dashboard.stats.certificates'), value: data.stats.certificates, icon: <Award size={20} />, color: 'bg-blue-50', text: 'text-blue-600' },
              ].map((stat, i) => (
                <div key={i} className="card !p-6 group flex flex-col items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center ${stat.text} group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Technical Assessment Score */}
            {data.technicalScore !== null && (
              <div className="card !p-10 bg-gradient-to-br from-emerald-50 to-teal-50/50 border-emerald-100 relative overflow-hidden group">
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[24px] bg-white shadow-sm flex items-center justify-center text-emerald-600 group-hover:rotate-12 transition-transform duration-500">
                      <Atom size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">{t('dashboard.tech_score_title')}</h3>
                      <p className="text-sm text-slate-600 max-w-sm">{t('dashboard.tech_score_desc')}</p>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="text-6xl font-black text-gradient drop-shadow-sm">
                      {data.technicalScore}%
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600 justify-center md:justify-end">
                      <Zap size={12} /> {t('dashboard.tech_stem_rank')}
                    </div>
                  </div>
                </div>
                <div className="mt-10 w-full h-2 bg-white rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000"
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
                  <div className="card !p-10 !h-max content-start">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-8 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><User size={16} /></div>
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
                        <div key={k} className="flex flex-col gap-1 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                          <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{k}</dt>
                          <dd className="text-slate-700 font-semibold">{v}</dd>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity / Notifications Preview */}
                  <div className="card !p-10 !h-max content-start">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-8 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><Bell size={16} /></div>
                      {t('dashboard.recent_notifications')}
                    </h3>
                    <div className="space-y-8">
                      {data.notifications.slice(0, 3).map((n) => (
                        <div key={n.id} className="relative pl-8 group">
                          {/* Timeline Line */}
                          <div className="absolute left-0 top-0 bottom-[-32px] w-0.5 bg-slate-100 group-last:hidden" />
                          <div className="absolute left-[-3px] top-2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]" />

                          <div className="font-bold text-slate-900 mb-1 text-sm">{n.title}</div>
                          <div className="text-xs text-slate-500 line-clamp-2 mb-2">{n.message}</div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</div>
                        </div>
                      ))}
                      {data.notifications.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 opacity-50">
                          <Bell size={32} className="mb-4 text-slate-400" />
                          <p className="text-sm text-slate-500 font-medium">{t('dashboard.no_activity')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="grid md:grid-cols-2 gap-8">
                  {data.projects.length === 0 && (
                    <div className="col-span-2 text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                      <Leaf size={48} className="mx-auto mb-6 text-slate-300" />
                      <p className="text-slate-500 font-semibold">{t('dashboard.no_projects')}</p>
                    </div>
                  )}
                  {data.projects.map((project) => {
                    const applied = appliedProjectIds.has(project.id);
                    return (
                      <div key={project.id} className="card !p-8 flex flex-col group">
                        <div className="flex justify-between items-start mb-6">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                            {t(`projects.categories.${project.category.toLowerCase()}`) || project.category}
                          </div>
                          <ComplexityDots level={project.complexityLevel} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-emerald-600 transition-colors">
                          {(locale === 'az' && project.titleAz) ? project.titleAz : project.title}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-8 leading-relaxed">
                          {(locale === 'az' && project.descriptionAz) ? project.descriptionAz : project.description}
                        </p>
                        <div className="mt-auto pt-4">
                          <button
                            onClick={() => !applied && applyToProject(project.id)}
                            disabled={applied || applying === project.id}
                            className={`w-full ${applied
                              ? 'py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default'
                              : 'btn-secondary !w-full !py-4'
                              }`}
                          >
                            {applying === project.id ? (
                              <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                                {t('dashboard.projects.applying_btn')}
                              </span>
                            ) : applied ? (
                              <span className="flex items-center justify-center gap-2">
                                <ShieldCheck size={16} />
                                {t('dashboard.projects.applied_btn')}
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-2">
                                {t('dashboard.projects.join_project')} <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'applications' && (
                <div className="space-y-6">
                  {data.applications.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                      <CheckCircle size={48} className="mx-auto mb-6 text-slate-300" />
                      <p className="text-slate-500 font-semibold">{t('dashboard.no_applications')}</p>
                    </div>
                  )}
                  {data.applications.map((app) => (
                    <div key={app.id} className="card !p-6 flex flex-col md:flex-row items-center justify-between gap-6 group cursor-pointer hover:border-emerald-200">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Leaf size={12} />
                          </div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                            {t(`projects.categories.${app.project.category.toLowerCase()}`) || app.project.category}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 tracking-tight mb-2 group-hover:text-emerald-600 transition-colors">
                          {(locale === 'az' && app.project.titleAz) ? app.project.titleAz : app.project.title}
                        </h4>
                        <div className="flex items-center gap-4">
                          <ComplexityDots level={app.project.complexityLevel} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t('dashboard.project_reference')}: {app.id.slice(0, 8)}</span>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-6">
                        <div className="h-8 w-px bg-slate-100 hidden md:block" />
                        <StatusBadge status={app.status} />
                        <ChevronRight className="text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" size={20} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  {data.notifications.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                      <Bell size={48} className="mx-auto mb-6 text-slate-300" />
                      <p className="text-slate-500 font-semibold">{t('dashboard.no_notifications')}</p>
                    </div>
                  )}
                  {data.notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`card !p-6 transition-all duration-300 group ${!notif.isRead ? 'bg-emerald-50/50 border-emerald-100 shadow-md shadow-emerald-500/5' : ''
                        }`}
                    >
                      <div className="flex justify-between items-start gap-8">
                        <div className="flex gap-4 sm:gap-6">
                          <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${!notif.isRead ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400 border border-slate-100'
                            }`}>
                            <Bell size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-3 mb-1.5">
                              {!notif.isRead && (
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                </span>
                              )}
                              {notif.title}
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{notif.message}</p>
                          </div>
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pt-2 shrink-0">
                          {new Date(notif.createdAt).toLocaleDateString(locale === 'az' ? 'az-AZ' : 'en-US')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'certificates' && (
                <div className="grid md:grid-cols-2 gap-8">
                  {data.certificates.length === 0 && (
                    <div className="col-span-2 text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Award size={32} className="text-slate-300" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-700 mb-2">{t('dashboard.no_certificates')}</h4>
                      <p className="text-slate-500 text-sm">{t('dashboard.complete_for_legacy')}</p>
                    </div>
                  )}
                  {data.certificates.map((cert) => (
                    <div key={cert.id} className="card !p-8 flex items-center gap-6 group cursor-pointer hover:border-emerald-200 shadow-sm overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-700" />

                      <div className="shrink-0 w-16 h-16 rounded-[20px] bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-all duration-500 relative z-10">
                        <Award size={28} />
                      </div>
                      <div className="relative z-10">
                        <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{cert.title}</h4>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            ID: {cert.id.slice(0, 12)}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                            {t('dashboard.issued')}: {new Date(cert.issuedAt).toLocaleDateString(locale === 'az' ? 'az-AZ' : 'en-US')}
                          </span>
                        </div>
                        <button className="mt-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-emerald-600 flex items-center gap-1.5 transition-colors">
                          {t('dashboard.download_pdf')} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
    </div>
  );
}
