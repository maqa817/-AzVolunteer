'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
    Search, ArrowRight, FolderOpen, MapPin, XCircle, FileText,
    Award, CheckCircle, Leaf, Monitor, GraduationCap, Handshake,
    Sparkles, Loader2, Calendar, Target, ShieldCheck,
} from 'lucide-react';
import { projectsApi, applicationsApi } from '../../lib/api';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../lib/auth-context';
import { useI18n } from '../../hooks/useI18n';
import Footer from '../../components/layout/Footer';

interface Project {
    id: string;
    title: string;
    titleAz?: string;
    description: string;
    descriptionAz?: string;
    location?: string;
    locationAz?: string;
    benefits?: string;
    benefitsAz?: string;
    requirements?: string;
    requirementsAz?: string;
    category: string;
    requiredSkills: string[];
    complexityLevel: 'low' | 'medium' | 'high' | 'expert';
    isActive: boolean;
    createdAt: string;
    deadline?: string;
    spotsLeft?: string;
    spotsLeftAz?: string;
}

const CategoryBadge = ({ category, t }: { category: string; t: any }) => {
    const icons: Record<string, any> = {
        social: <Handshake size={13} />,
        technical: <Monitor size={13} />,
        educational: <GraduationCap size={13} />,
        environmental: <Leaf size={13} />,
    };
    const colors: Record<string, string> = {
        social: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        technical: 'bg-blue-50 text-blue-600 border-blue-100',
        educational: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        environmental: 'bg-teal-50 text-teal-600 border-teal-100',
    };
    const catKey = category.toLowerCase();
    return (
        <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${colors[catKey] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
            <span>{icons[catKey] || <Sparkles size={13} />}</span>
            {t(`projects.categories.${catKey}`) || category}
        </div>
    );
};

const ComplexityDots = ({ level }: { level: string }) => {
    const count = level === 'low' ? 1 : level === 'medium' ? 2 : level === 'high' ? 3 : 4;
    return (
        <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < count ? 'bg-emerald-400' : 'bg-slate-200'}`} />
            ))}
        </div>
    );
};

export default function ProjectsPage() {
    const { t, locale } = useI18n();
    const { user } = useAuth();
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [complexity, setComplexity] = useState('');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => { fetchProjects(); }, [category, complexity]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await projectsApi.getAll({ category, complexity, search });
            setProjects(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProjects();
    };

    const handleApply = async (projectId: string) => {
        if (!user) { router.push('/auth/register'); return; }
        setApplying(projectId);
        try {
            await applicationsApi.apply(projectId);
            toast.success(t('dashboard.apply_success'));
            setSelectedProject(null);
        } catch (err: any) {
            toast.error(err.response?.data?.message || t('dashboard.apply_error'));
        } finally {
            setApplying(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* ── Page Header ── */}
            <div className="relative pt-36 pb-24 overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/40 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/4 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-50/30 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/4 pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-5 lg:px-8 text-center animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                        <Target size={13} />
                        Available Missions
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-5 tracking-tight leading-tight">
                        {t('projects.title')}{' '}
                        <span className="text-emerald-500">{t('features.titleHighlight')}</span>
                    </h1>
                    <p className="text-slate-500 max-w-xl mx-auto text-lg font-medium">
                        {t('projects.subtitle')}
                    </p>
                </div>
            </div>

            {/* ── Filter & Search ── */}
            <div className="max-w-7xl mx-auto px-5 lg:px-8 -mt-10 relative z-20">
                <div className="bg-white p-3 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search size={18} className="text-slate-300" />
                            </div>
                            <input
                                type="text"
                                placeholder={t('projects.search_placeholder')}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="input-field pl-12 !rounded-2xl !border-transparent hover:!border-slate-200 !bg-slate-50 focus:!bg-white"
                            />
                        </div>

                        <div className="flex flex-wrap sm:flex-nowrap gap-3">
                            <select
                                className="input-field !rounded-2xl !border-transparent !bg-slate-50 appearance-none cursor-pointer flex-1 sm:min-w-[160px]"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                            >
                                <option value="">{t('projects.all_categories')}</option>
                                <option value="Social">{t('projects.categories.social')}</option>
                                <option value="Technical">{t('projects.categories.technical')}</option>
                                <option value="Educational">{t('projects.categories.educational')}</option>
                                <option value="Environmental">{t('projects.categories.environmental')}</option>
                            </select>

                            <select
                                className="input-field !rounded-2xl !border-transparent !bg-slate-50 appearance-none cursor-pointer flex-1 sm:min-w-[150px]"
                                value={complexity}
                                onChange={e => setComplexity(e.target.value)}
                            >
                                <option value="">{t('projects.all_levels')}</option>
                                <option value="low">{t('projects.complexity.low')}</option>
                                <option value="medium">{t('projects.complexity.medium')}</option>
                                <option value="high">{t('projects.complexity.high')}</option>
                                <option value="expert">{t('projects.complexity.expert')}</option>
                            </select>

                            <button type="submit" className="btn-primary !px-8 !rounded-2xl !py-3 whitespace-nowrap">
                                <Search size={18} />
                                <span className="font-bold">{t('common.search')}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* ── Projects Grid ── */}
            <div className="section-container pb-32">
                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="card h-96 animate-pulse bg-slate-100 border-0 shadow-none" />
                        ))}
                    </div>
                ) : projects.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                        {projects.map(project => (
                            <div key={project.id} className="group card !p-0 flex flex-col h-full hover:border-emerald-200 !rounded-3xl overflow-hidden">
                                <div className="p-6 sm:p-8 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-5">
                                        <CategoryBadge category={project.category} t={t} />
                                        <ComplexityDots level={project.complexityLevel} />
                                    </div>

                                    <h3 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors leading-snug">
                                        {(locale === 'az' && project.titleAz) ? project.titleAz : project.title}
                                    </h3>

                                    {project.spotsLeft && (
                                        <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-xl border border-amber-100 w-fit">
                                            <Sparkles size={12} className="animate-pulse" />
                                            {(locale === 'az' && project.spotsLeftAz) ? project.spotsLeftAz : project.spotsLeft}
                                        </div>
                                    )}

                                    <p className="text-slate-500 text-sm font-medium line-clamp-3 mb-6 flex-grow leading-relaxed">
                                        {(locale === 'az' && project.descriptionAz) ? project.descriptionAz : project.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mb-6 pt-5 border-t border-slate-50">
                                        <div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('projects.location')}</div>
                                            <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs truncate">
                                                <MapPin size={12} className="text-emerald-500 shrink-0" />
                                                {(locale === 'az' && project.locationAz) ? project.locationAz : project.location || 'Azerbaijan'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Deadline</div>
                                            <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                                                <Calendar size={12} className="text-emerald-500 shrink-0" />
                                                {project.deadline || new Date(project.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <button
                                            onClick={() => setSelectedProject(project)}
                                            className="text-[11px] font-bold text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-1.5 uppercase tracking-widest"
                                        >
                                            {t('projects.details')}
                                            <ArrowRight size={14} />
                                        </button>
                                        <button
                                            onClick={() => setSelectedProject(project)}
                                            className="btn-primary !px-5 !py-2.5 !rounded-xl !text-[11px] tracking-wide"
                                        >
                                            {t('projects.apply_button')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Login CTA card */}
                        {!user && (
                            <div className="group card flex flex-col items-center justify-center text-center p-8 bg-emerald-600 border-none !rounded-3xl relative overflow-hidden h-full">
                                <div className="absolute inset-0 opacity-10 pointer-events-none"
                                    style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6 mx-auto backdrop-blur-md">
                                        <ShieldCheck size={28} className="text-white" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-4 leading-snug">{t('projects.login_to_see_more')}</h3>
                                    <p className="text-emerald-50 text-sm mb-7 font-medium opacity-90">{t('projects.login_to_see_more_desc')}</p>
                                    <div className="flex flex-col gap-3 w-full">
                                        <Link href="/auth/login" className="bg-white text-emerald-600 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all">
                                            {t('projects.sign_in_cta')}
                                        </Link>
                                        <Link href="/auth/register" className="text-white/80 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">
                                            {t('projects.register_cta')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-32 animate-fade-in">
                        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                            <Leaf size={36} className="text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-3">{t('projects.empty_state')}</h2>
                        <p className="text-slate-400 font-medium">Daha fərqli axtarış meyarları sınaqdan keçirin</p>
                    </div>
                )}
            </div>

            {/* ══════════════════════════════════════════
                PROJECT DETAILS MODAL — FULLY RESPONSIVE
                ══════════════════════════════════════════ */}
            {selectedProject && (
                <div
                    className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-slate-900/70 backdrop-blur-sm animate-fade-in"
                    onClick={e => { if (e.target === e.currentTarget) setSelectedProject(null); }}
                >
                    {/* Modal panel — slides up from bottom on mobile, centered on desktop */}
                    <div className="bg-white w-full sm:max-w-2xl lg:max-w-4xl max-h-[92vh] sm:max-h-[88vh] rounded-t-[28px] sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-slide-up">

                        {/* ── Hero area ── */}
                        <div className="relative h-40 sm:h-52 md:h-60 shrink-0 bg-slate-900 overflow-hidden">
                            <div className="absolute inset-0">
                                <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/60 blur-[80px] rounded-full" />
                                <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-blue-500/50 blur-[70px] rounded-full" />
                            </div>

                            {/* Close */}
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10 backdrop-blur-xl transition-all"
                                aria-label="Close"
                            >
                                <XCircle size={18} />
                            </button>

                            {/* Overlay text */}
                            <div className="absolute inset-0 z-10 flex items-end p-4 sm:p-6 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent">
                                <div className="w-full">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <CategoryBadge category={selectedProject.category} t={t} />
                                        <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-xl">
                                            <span className="text-[9px] text-white/50 font-black uppercase tracking-widest">Level</span>
                                            <ComplexityDots level={selectedProject.complexityLevel} />
                                        </div>
                                    </div>
                                    <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white leading-tight tracking-tight">
                                        {(locale === 'az' && selectedProject.titleAz) ? selectedProject.titleAz : selectedProject.title}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* ── Scrollable content ── */}
                        <div className="flex-1 overflow-y-auto overscroll-contain">
                            <div className="p-4 sm:p-6 md:p-8 space-y-6">

                                {/* Description */}
                                <div>
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 flex-shrink-0">
                                            <FileText size={15} />
                                        </div>
                                        <h3 className="text-base font-extrabold text-slate-900">Missiya Haqqında</h3>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-medium whitespace-pre-line">
                                        {(locale === 'az' && selectedProject.descriptionAz) ? selectedProject.descriptionAz : selectedProject.description}
                                    </p>
                                </div>

                                {/* Benefits & Requirements — side by side on sm+, stacked on xs */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Award size={15} className="text-emerald-500 flex-shrink-0" />
                                            <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">{t('projects.benefits')}</h4>
                                        </div>
                                        <ul className="space-y-2">
                                            {((locale === 'az' && selectedProject.benefitsAz) ? selectedProject.benefitsAz : selectedProject.benefits || '')
                                                .split('\n').filter(Boolean).map((item, i) => (
                                                    <li key={i} className="text-xs sm:text-sm text-slate-700 font-medium flex gap-2 leading-relaxed">
                                                        <CheckCircle size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                                                        {item.trim()}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>

                                    <div className="p-4 sm:p-5 rounded-2xl bg-blue-50 border border-blue-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <ShieldCheck size={15} className="text-blue-500 flex-shrink-0" />
                                            <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">{t('projects.requirements')}</h4>
                                        </div>
                                        <ul className="space-y-2">
                                            {((locale === 'az' && selectedProject.requirementsAz) ? selectedProject.requirementsAz : selectedProject.requirements || '')
                                                .split('\n').filter(Boolean).map((item, i) => (
                                                    <li key={i} className="text-xs sm:text-sm text-slate-700 font-medium flex gap-2 leading-relaxed">
                                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                                                        {item.trim()}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </div>

                                {/* Meta info + Apply */}
                                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 sm:p-5 space-y-4">
                                    <div className="flex flex-wrap gap-4">
                                        {/* Location */}
                                        <div className="flex-1 min-w-[140px]">
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Location</div>
                                            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-100">
                                                <MapPin size={14} className="text-emerald-500 flex-shrink-0" />
                                                <span className="font-bold text-slate-800 text-xs truncate">
                                                    {(locale === 'az' && selectedProject.locationAz) ? selectedProject.locationAz : selectedProject.location || 'Azerbaijan'}
                                                </span>
                                            </div>
                                        </div>
                                        {/* Skills */}
                                        <div className="flex-1 min-w-[140px]">
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Required Skills</div>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedProject.requiredSkills.map(skill => (
                                                    <span key={skill} className="px-2 py-1 bg-white text-emerald-600 font-bold rounded-lg border border-emerald-100 text-[9px] uppercase tracking-wide">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notice */}
                                    <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                        <Sparkles size={13} className="text-amber-500 shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                                            {t('projects.eligibility_notice')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Sticky bottom Apply button ── */}
                        <div className="shrink-0 p-4 sm:p-5 border-t border-slate-100 bg-white">
                            <button
                                onClick={() => handleApply(selectedProject.id)}
                                disabled={!!applying}
                                className="btn-primary w-full !py-4 !rounded-2xl !text-base"
                            >
                                {applying === selectedProject.id ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <>
                                        <span>Join Mission</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
