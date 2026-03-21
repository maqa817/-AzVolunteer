'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Search, Filter, ArrowRight, FolderOpen, Clock, Tag, ChevronRight, MapPin, XCircle, FileText, Award, CheckCircle, Leaf, Monitor, GraduationCap, Handshake, Sparkles, Loader2 } from 'lucide-react';
import { projectsApi, applicationsApi } from '../../lib/api';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../lib/auth-context';
import { useI18n } from '../../hooks/useI18n';

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


const CategoryIcon = ({ category }: { category: string }) => {
    switch (category.toLowerCase()) {
        case 'social': return <Handshake size={14} />;
        case 'technical': return <Monitor size={14} />;
        case 'educational': return <GraduationCap size={14} />;
        case 'environmental': return <Leaf size={14} />;
        default: return <Sparkles size={14} />;
    }
};

const CategoryBadge = ({ category, t }: { category: string, t: any }) => {
    const icons: Record<string, string> = {
        social: '🤝',
        technical: '💻',
        educational: '📚',
        environmental: '🌍',
    };

    const catKey = category.toLowerCase();

    return (
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
            <span>{icons[catKey] || '✨'}</span>
            {t(`projects.categories.${catKey}`) || category}
        </div>
    );
};

const ComplexityDots = ({ level }: { level: string }) => {
    const count = level === 'low' ? 1 : level === 'medium' ? 2 : level === 'high' ? 3 : 4;
    return (
        <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${i < count ? 'bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.6)]' : 'bg-white/10'}`}
                />
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

    useEffect(() => {
        fetchProjects();
    }, [category, complexity]);

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
        if (!user) {
            router.push('/auth/register');
            return;
        }

        setApplying(projectId);
        try {
            await applicationsApi.apply(projectId);
            toast.success(t('dashboard.apply_success'));
            setSelectedProject(null);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || t('dashboard.apply_error');
            toast.error(errorMsg);
        } finally {
            setApplying(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a1a0f]">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-40 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-green-800/10 blur-[130px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-800/10 blur-[130px] rounded-full animate-pulse delay-700" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/5 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-in backdrop-blur-md">
                        <Leaf size={14} className="fill-green-400/20" />
                        {t('hero.badge')}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
                        {t('projects.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-300">{t('features.titleHighlight')}</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-medium italic opacity-80 leading-relaxed">
                        {t('projects.subtitle')}
                    </p>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 relative z-10">
                <div className="card p-2 md:p-3 bg-emerald-950/40 backdrop-blur-2xl border-white/5 rounded-[24px]">
                    <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-3">
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                                <Leaf className="text-green-500/60" size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder={t('projects.search_placeholder')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input-field pl-14 h-14 !rounded-2xl border-white/5 bg-black/20 focus:bg-black/40 text-base"
                            />
                        </div>

                        <div className="flex flex-wrap md:flex-nowrap gap-3">
                            <div className="relative inline-block min-w-[180px]">
                                <select
                                    className="input-field h-14 !rounded-2xl border-white/5 bg-black/20 appearance-none text-sm font-bold tracking-wide pl-5 pr-10 cursor-pointer hover:bg-black/30 transition-colors"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">{t('projects.all_categories')}</option>
                                    <option value="Social">{t('projects.categories.social')}</option>
                                    <option value="Technical">{t('projects.categories.technical')}</option>
                                    <option value="Educational">{t('projects.categories.educational')}</option>
                                    <option value="Environmental">{t('projects.categories.environmental')}</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                    <Filter size={14} />
                                </div>
                            </div>

                            <div className="relative inline-block min-w-[180px]">
                                <select
                                    className="input-field h-14 !rounded-2xl border-white/5 bg-black/20 appearance-none text-sm font-bold tracking-wide pl-5 pr-10 cursor-pointer hover:bg-black/30 transition-colors"
                                    value={complexity}
                                    onChange={(e) => setComplexity(e.target.value)}
                                >
                                    <option value="">{t('projects.all_levels')}</option>
                                    <option value="low">{t('projects.complexity.low')}</option>
                                    <option value="medium">{t('projects.complexity.medium')}</option>
                                    <option value="high">{t('projects.complexity.high')}</option>
                                    <option value="expert">{t('projects.complexity.expert')}</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                    <Sparkles size={14} />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary h-14 px-10 group shadow-green-500/10">
                                <Search size={18} className="group-hover:scale-110 transition-transform" />
                                <span className="uppercase tracking-[0.2em] text-xs font-black">{t('common.search')}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-40">
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="card h-80 animate-pulse bg-emerald-950/20 border-white/5" />
                        ))}
                    </div>
                ) : projects.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {(user ? projects : projects.slice(0, 6)).map((project) => (
                            <div key={project.id} className="group card !p-0 flex flex-col h-full bg-[#132b1a] hover:bg-[#1a3d22] transition-colors duration-500 border-white/5 shadow-2xl overflow-hidden shadow-black/40">
                                {/* Card Header Gradient */}
                                <div className="h-3 bg-gradient-to-r from-green-600 via-lime-500 to-emerald-600 opacity-60 group-hover:opacity-100 transition-opacity" />

                                <div className="p-8 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-8">
                                        <CategoryBadge category={project.category} t={t} />
                                        <ComplexityDots level={project.complexityLevel} />
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors leading-tight">
                                        {(locale === 'az' && project.titleAz) ? project.titleAz : project.title}
                                    </h3>
                                    {project.spotsLeft && (
                                        <div className="mb-4 text-[10px] font-black uppercase text-amber-400 flex items-center gap-1.5 animate-pulse">
                                            <Sparkles size={12} />
                                            {(locale === 'az' && project.spotsLeftAz) ? project.spotsLeftAz : project.spotsLeft}
                                        </div>
                                    )}


                                    <p className="text-slate-400 text-sm font-medium italic opacity-70 line-clamp-3 mb-8 flex-grow leading-relaxed">
                                        {(locale === 'az' && project.descriptionAz) ? project.descriptionAz : project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 mb-8 pb-8 border-b border-white/5">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 border border-white/5">
                                            <MapPin size={14} className="text-green-500" />
                                            {(locale === 'az' && project.locationAz) ? project.locationAz : project.location || 'Azerbaijan'}
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 border border-white/5">
                                            <Clock size={14} className="text-green-500" />
                                            {project.deadline || new Date(project.createdAt).toLocaleDateString()}
                                        </div>

                                    </div>

                                    <div className="flex items-center justify-between mt-auto">
                                        <button
                                            onClick={() => setSelectedProject(project)}
                                            className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors flex items-center gap-2 group/btn"
                                        >
                                            <FileText size={14} className="text-green-500 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                                            {t('projects.details')}
                                        </button>

                                        <button
                                            onClick={() => setSelectedProject(project)}
                                            className="relative overflow-hidden btn-primary !text-[10px] !px-6 !py-2.5 uppercase tracking-widest group/apply"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                {t('projects.apply_button')}
                                                <ChevronRight size={14} className="group-hover/apply:translate-x-1 transition-transform" />
                                            </span>
                                            {/* Shimmer effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/apply:animate-shimmer" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Login to see more CTA */}
                        {!user && projects.length > 6 && (
                            <div className="group card flex flex-col items-center justify-center text-center p-12 bg-green-950/20 border-2 border-dashed border-green-500/20 hover:border-green-500/40 transition-all rounded-[32px] relative overflow-hidden h-full">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
                                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 ring-4 ring-green-500/5">
                                    <Sparkles size={28} className="text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{t('projects.login_to_see_more')}</h3>
                                <p className="text-slate-400 text-sm mb-10 max-w-[240px] italic font-medium opacity-80">{t('projects.login_to_see_more_desc')}</p>
                                <div className="flex flex-col gap-4 w-full px-4">
                                    <Link
                                        href="/auth/login"
                                        className="btn-primary w-full py-4 uppercase text-[10px] font-black tracking-[0.2em] shadow-xl shadow-green-900/20"
                                    >
                                        {t('projects.sign_in_cta')}
                                    </Link>
                                    <Link
                                        href="/auth/register"
                                        className="text-slate-400 hover:text-green-400 text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
                                    >
                                        {t('projects.register_cta')}
                                    </Link>
                                </div>
                            </div>
                        )}

                    </div>
                ) : (
                    <div className="text-center py-40">
                        <div className="w-24 h-24 bg-emerald-950/40 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-2xl text-green-500/20">
                            <Leaf size={48} />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-3">
                            {t('projects.empty_state')}
                        </h2>
                        <p className="text-slate-500 font-medium italic">
                            Daha fərqli axtarış meyarları sınaqdan keçirin
                        </p>
                    </div>
                )}
            </div>

            {/* Project Details Modal */}
            {selectedProject && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-[#0a1a0fb0] backdrop-blur-2xl animate-fade-in">
                    <div className="bg-[#0f2318] border border-white/10 rounded-[40px] w-full max-w-4xl max-h-full overflow-y-auto shadow-[0_32px_120px_rgba(0,0,0,0.6)] relative animate-slide-up scrollbar-hide">
                        {/* Modal Header */}
                        <div className="h-64 md:h-80 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 via-emerald-600/20 to-[#0f2318] z-0" />
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-8 right-8 p-3 bg-black/40 text-white rounded-full hover:bg-black transition-all hover:scale-110 active:scale-90 z-50 backdrop-blur-xl border border-white/10"
                            >
                                <XCircle size={24} />
                            </button>

                            <div className="absolute inset-0 flex items-end p-10 md:p-16 z-10 bg-gradient-to-t from-[#0f2318] via-transparent to-transparent">
                                <div>
                                    <div className="flex flex-wrap items-center gap-4 mb-6">
                                        <CategoryBadge category={selectedProject.category} t={t} />
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Complexity:</span>
                                            <ComplexityDots level={selectedProject.complexityLevel} />
                                        </div>
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-4">
                                        {(locale === 'az' && selectedProject.titleAz) ? selectedProject.titleAz : selectedProject.title}
                                    </h2>
                                    <div className="flex items-center gap-6 text-slate-400 text-sm font-bold uppercase tracking-widest opacity-60">
                                        <span className="flex items-center gap-2"><MapPin size={16} className="text-green-500" /> {(locale === 'az' && selectedProject.locationAz) ? selectedProject.locationAz : selectedProject.location || 'Azerbaijan'}</span>
                                        <span className="flex items-center gap-2"><Clock size={16} className="text-green-500" /> {selectedProject.deadline || new Date(selectedProject.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {selectedProject.spotsLeft && (
                                        <div className="mt-4 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl inline-flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-widest animate-pulse">
                                            <Sparkles size={14} />
                                            {(locale === 'az' && selectedProject.spotsLeftAz) ? selectedProject.spotsLeftAz : selectedProject.spotsLeft}
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>

                        <div className="p-10 md:p-16">
                            <div className="grid lg:grid-cols-3 gap-16">
                                <div className="lg:col-span-2 space-y-16">
                                    {/* Description */}
                                    <div>
                                        <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8 flex items-center gap-4 text-green-500">
                                            <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                                                <FileText size={20} />
                                            </div>
                                            {t('dashboard.tabs.overview')}
                                        </h3>
                                        <p className="text-slate-300 leading-relaxed text-xl font-medium italic opacity-90 whitespace-pre-line">
                                            {(locale === 'az' && selectedProject.descriptionAz) ? selectedProject.descriptionAz : selectedProject.description}
                                        </p>
                                    </div>

                                    {/* Benefits & Requirements */}
                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="p-8 rounded-[32px] bg-green-500/5 border border-green-500/10 hover:bg-green-500/10 transition-colors group">
                                            <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                                <Award size={18} className="text-green-400 group-hover:scale-110 transition-transform" />
                                                {t('projects.benefits')}
                                            </h3>
                                            <ul className="space-y-4">
                                                {((locale === 'az' && selectedProject.benefitsAz) ? selectedProject.benefitsAz : selectedProject.benefits || '')
                                                    .split('\n').filter(Boolean).map((item, i) => (
                                                        <li key={i} className="text-sm text-slate-400 font-bold flex gap-3 leading-relaxed">
                                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shrink-0 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                                                            {item.trim()}
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>

                                        <div className="p-8 rounded-[32px] bg-lime-500/5 border border-lime-500/10 hover:bg-lime-500/10 transition-colors group">
                                            <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                                <CheckCircle size={18} className="text-lime-400 group-hover:scale-110 transition-transform" />
                                                {t('projects.requirements')}
                                            </h3>
                                            <ul className="space-y-4">
                                                {((locale === 'az' && selectedProject.requirementsAz) ? selectedProject.requirementsAz : selectedProject.requirements || '')
                                                    .split('\n').filter(Boolean).map((item, i) => (
                                                        <li key={i} className="text-sm text-slate-400 font-bold flex gap-3 leading-relaxed">
                                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0 shadow-[0_0_8px_rgba(163,230,53,0.5)]" />
                                                            {item.trim()}
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="card p-10 bg-black/20 border-white/5 rounded-[40px] sticky top-10 shadow-3xl overflow-hidden group/meta">
                                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/10 blur-[60px] rounded-full group-hover/meta:scale-150 transition-transform duration-700" />

                                        <div className="space-y-10 relative z-10">
                                            <div>
                                                <div className="text-[10px] uppercase font-black text-green-500 mb-4 tracking-[0.3em]">{t('projects.location')}</div>
                                                <div className="text-white font-bold flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                                    <MapPin size={22} className="text-green-400" />
                                                    {(locale === 'az' && selectedProject.locationAz) ? selectedProject.locationAz : selectedProject.location || 'Azerbaijan'}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-[10px] uppercase font-black text-green-500 mb-4 tracking-[0.3em]">{t('projects.skills')}</div>
                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {selectedProject.requiredSkills.map(skill => (
                                                        <span key={skill} className="px-4 py-2 bg-emerald-950 text-green-300 font-black rounded-xl border border-green-500/10 text-[10px] uppercase tracking-widest">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {selectedProject.requiredSkills.length === 0 && <span className="text-slate-600 text-xs italic font-bold">General Skills</span>}
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 mb-2">
                                                <p className="text-[10px] text-amber-500/80 font-medium leading-relaxed italic">
                                                    {t('projects.eligibility_notice')}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleApply(selectedProject.id)}
                                                disabled={!!applying}
                                                className="btn-primary w-full py-5 text-sm font-black uppercase tracking-[0.2em] shadow-3xl shadow-green-500/20 group/go flex items-center justify-center gap-3"
                                            >
                                                {applying === selectedProject.id ? (
                                                    <Loader2 size={18} className="animate-spin" />
                                                ) : (
                                                    <>
                                                        {t('dashboard.projects.apply_btn')}
                                                        <ChevronRight size={18} className="group-hover/go:translate-x-2 transition-transform" />
                                                    </>
                                                )}
                                            </button>

                                            <p className="text-center text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-6">
                                                Protect our future
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes shimmer {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 1.5s infinite;
                }
            `}</style>
        </div>
    );
}
