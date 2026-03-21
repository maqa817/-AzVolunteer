'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Search, Filter, ArrowRight, FolderOpen, Clock, Tag, ChevronRight, MapPin, XCircle, FileText, Award, CheckCircle, Leaf, Monitor, GraduationCap, Handshake, Sparkles, Loader2, Calendar, Target, ShieldCheck } from 'lucide-react';
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

const CategoryBadge = ({ category, t }: { category: string, t: any }) => {
    const icons: Record<string, any> = {
        social: <Handshake size={14} />,
        technical: <Monitor size={14} />,
        educational: <GraduationCap size={14} />,
        environmental: <Leaf size={14} />,
    };

    const colors: Record<string, string> = {
        social: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        technical: 'bg-blue-50 text-blue-600 border-blue-100',
        educational: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        environmental: 'bg-teal-50 text-teal-600 border-teal-100',
    };

    const catKey = category.toLowerCase();

    return (
        <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border ${colors[catKey] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
            <span>{icons[catKey] || <Sparkles size={14} />}</span>
            {t(`projects.categories.${catKey}`) || category}
        </div>
    );
};

const ComplexityDots = ({ level }: { level: string }) => {
    const count = level === 'low' ? 1 : level === 'medium' ? 2 : level === 'high' ? 3 : 4;
    return (
        <div className="flex gap-1.5">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${i < count ? 'bg-emerald-400' : 'bg-slate-200'}`}
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
        <div className="min-h-screen bg-slate-50 transition-colors duration-500">
            <Navbar />

            {/* Header Section */}
            <div className="relative pt-44 pb-32 overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/30 blur-[100px] rounded-full translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-1/4 h-full bg-blue-50/20 blur-[80px] rounded-full -translate-x-1/2" />
                
                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-[0.25em] mb-10">
                        <Target size={14} />
                        Available Missions
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-[-0.03em] leading-tight">
                        {t('projects.title')}{' '}
                        <span className="text-emerald-500">
                            {t('features.titleHighlight')}
                        </span>
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium">
                        {t('projects.subtitle')}
                    </p>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-14 relative z-20">
                <div className="bg-white p-3 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100">
                    <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none opacity-40 group-focus-within:opacity-100 transition-opacity">
                                <Search size={20} className="text-emerald-500" />
                            </div>
                            <input
                                type="text"
                                placeholder={t('projects.search_placeholder')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input-field pl-16 h-16 !rounded-3xl border-slate-100 hover:border-slate-200 transition-colors"
                            />
                        </div>

                        <div className="flex flex-wrap md:flex-nowrap gap-4">
                            <div className="relative inline-block min-w-[200px]">
                                <select
                                    className="input-field h-16 !rounded-3xl border-slate-100 pr-12 appearance-none cursor-pointer font-bold text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_1.5rem_center] bg-no-repeat"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">{t('projects.all_categories')}</option>
                                    <option value="Social">{t('projects.categories.social')}</option>
                                    <option value="Technical">{t('projects.categories.technical')}</option>
                                    <option value="Educational">{t('projects.categories.educational')}</option>
                                    <option value="Environmental">{t('projects.categories.environmental')}</option>
                                </select>
                            </div>

                            <div className="relative inline-block min-w-[200px]">
                                <select
                                    className="input-field h-16 !rounded-3xl border-slate-100 pr-12 appearance-none cursor-pointer font-bold text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_1.5rem_center] bg-no-repeat"
                                    value={complexity}
                                    onChange={(e) => setComplexity(e.target.value)}
                                >
                                    <option value="">{t('projects.all_levels')}</option>
                                    <option value="low">{t('projects.complexity.low')}</option>
                                    <option value="medium">{t('projects.complexity.medium')}</option>
                                    <option value="high">{t('projects.complexity.high')}</option>
                                    <option value="expert">{t('projects.complexity.expert')}</option>
                                </select>
                            </div>

                            <button type="submit" className="btn-primary !h-16 px-12 !rounded-3xl shadow-emerald-500/10 active:scale-95 transition-all">
                                <Search size={22} className="stroke-[3]" />
                                <span className="uppercase tracking-widest text-[11px] font-black">{t('common.search')}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="section-container pb-40">
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="card h-[450px] animate-pulse bg-white border-slate-100 rounded-[2.5rem]" />
                        ))}
                    </div>
                ) : projects.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
                        {projects.map((project) => (
                            <div key={project.id} className="group card !p-0 flex flex-col h-full bg-white hover:border-emerald-200 transition-all duration-500 rounded-[2.5rem] overflow-hidden border-slate-100">
                                {/* Card Body */}
                                <div className="p-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-8">
                                        <CategoryBadge category={project.category} t={t} />
                                        <ComplexityDots level={project.complexityLevel} />
                                    </div>

                                    <h3 className="text-2xl font-extrabold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors leading-tight">
                                        {(locale === 'az' && project.titleAz) ? project.titleAz : project.title}
                                    </h3>

                                    {project.spotsLeft && (
                                        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-xl border border-amber-100/50 w-fit">
                                            <Sparkles size={14} className="animate-pulse" />
                                            {(locale === 'az' && project.spotsLeftAz) ? project.spotsLeftAz : project.spotsLeft}
                                        </div>
                                    )}

                                    <p className="text-slate-500 text-sm font-medium line-clamp-3 mb-10 flex-grow leading-relaxed">
                                        {(locale === 'az' && project.descriptionAz) ? project.descriptionAz : project.description}
                                    </p>

                                    {/* Project Meta */}
                                    <div className="grid grid-cols-2 gap-4 mb-10 pt-8 border-t border-slate-50">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest uppercase">{t('projects.location')}</span>
                                            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs truncate">
                                                <MapPin size={14} className="text-emerald-500 shrink-0" />
                                                {(locale === 'az' && project.locationAz) ? project.locationAz : project.location || 'Azerbaijan'}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest uppercase">Deadline</span>
                                            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                                                <Calendar size={14} className="text-emerald-500 shrink-0" />
                                                {project.deadline || new Date(project.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <button
                                            onClick={() => setSelectedProject(project)}
                                            className="text-[12px] font-bold text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-2 uppercase tracking-widest group/btn"
                                        >
                                            {t('projects.details')}
                                            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>

                                        <button
                                            onClick={() => setSelectedProject(project)}
                                            className="btn-primary !px-6 !py-3.5 !rounded-2xl !text-[10px] tracking-widest uppercase"
                                        >
                                            {t('projects.apply_button')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Sign In Reminder Reminder CTA */}
                        {!user && (
                            <div className="group card flex flex-col items-center justify-center text-center p-12 bg-emerald-600 border-none rounded-[2.5rem] relative overflow-hidden h-full shadow-emerald-200">
                                {/* Abstract background patterns */}
                                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                                     style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
                                
                                <div className="relative z-10">
                                    <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-500 backdrop-blur-md ring-8 ring-white/5">
                                        <ShieldCheck size={36} className="text-white" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-6 leading-[1.1]">{t('projects.login_to_see_more')}</h3>
                                    <p className="text-emerald-50 text-base mb-10 font-medium opacity-90 leading-relaxed px-4">{t('projects.login_to_see_more_desc')}</p>
                                    
                                    <div className="flex flex-col gap-4 w-full px-6">
                                        <Link
                                            href="/auth/login"
                                            className="bg-white text-emerald-600 px-8 py-5 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest hover:bg-emerald-50 hover:-translate-y-1 transition-all shadow-xl shadow-emerald-900/10"
                                        >
                                            {t('projects.sign_in_cta')}
                                        </Link>
                                        <Link
                                            href="/auth/register"
                                            className="text-white/80 hover:text-white font-bold text-xs uppercase tracking-[0.2em] transition-colors"
                                        >
                                            {t('projects.register_cta')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-40 animate-fade-in px-6">
                        <div className="w-28 h-28 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-emerald-100 shadow-xl shadow-emerald-100/50">
                            <Leaf size={48} className="text-emerald-400" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">
                            {t('projects.empty_state')}
                        </h2>
                        <p className="text-slate-500 text-lg font-medium italic max-w-sm mx-auto">
                            Daha fərqli axtarış meyarları sınaqdan keçirin
                        </p>
                    </div>
                )}
            </div>

            {/* Project Details Modal */}
            {selectedProject && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-slate-900/60 backdrop-blur-xl animate-fade-in">
                    <div className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,0.3)] relative flex flex-col animate-slide-up">
                        
                        {/* Modal Hero */}
                        <div className="relative h-64 md:h-80 w-full shrink-0 overflow-hidden bg-slate-900">
                             {/* Mesh Gradient Background */}
                            <div className="absolute inset-0 opacity-40">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500 blur-[80px] rounded-full animate-pulse" />
                                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 blur-[60px] rounded-full animate-pulse delay-700" />
                            </div>

                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-8 right-8 p-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all z-50 backdrop-blur-xl border border-white/10 hover:scale-105 active:scale-95"
                            >
                                <XCircle size={24} />
                            </button>

                            <div className="absolute inset-0 flex items-end p-12 md:p-16 z-10 bg-gradient-to-t from-slate-900 to-transparent">
                                <div className="w-full">
                                    <div className="flex flex-wrap items-center gap-4 mb-6">
                                        <CategoryBadge category={selectedProject.category} t={t} />
                                        <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-xl flex items-center gap-3">
                                            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Level:</span>
                                            <ComplexityDots level={selectedProject.complexityLevel} />
                                        </div>
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-none">
                                        {(locale === 'az' && selectedProject.titleAz) ? selectedProject.titleAz : selectedProject.title}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-12 md:p-16 scrollbar-hide">
                            <div className="grid lg:grid-cols-3 gap-16">
                                <div className="lg:col-span-2 space-y-16">
                                    {/* Description Section */}
                                    <div>
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                                                <FileText size={22} />
                                            </div>
                                            <h3 className="text-slate-900 font-extrabold text-2xl tracking-tight">Missiya Haqqında</h3>
                                        </div>
                                        <p className="text-slate-600 leading-relaxed text-xl font-medium whitespace-pre-line">
                                            {(locale === 'az' && selectedProject.descriptionAz) ? selectedProject.descriptionAz : selectedProject.description}
                                        </p>
                                    </div>

                                    {/* Benefits & Requirements Grids */}
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="p-10 rounded-[2.5rem] bg-emerald-50/50 border border-emerald-50 hover:bg-emerald-50 transition-colors duration-500">
                                            <div className="flex items-center gap-3 mb-8">
                                                <Award size={20} className="text-emerald-500" />
                                                <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">{t('projects.benefits')}</h4>
                                            </div>
                                            <ul className="space-y-4">
                                                {((locale === 'az' && selectedProject.benefitsAz) ? selectedProject.benefitsAz : selectedProject.benefits || '')
                                                    .split('\n').filter(Boolean).map((item, i) => (
                                                        <li key={i} className="text-sm text-slate-700 font-bold flex gap-3 leading-relaxed">
                                                            <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                                            {item.trim()}
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>

                                        <div className="p-10 rounded-[2.5rem] bg-blue-50/50 border border-blue-50 hover:bg-blue-50 transition-colors duration-500">
                                            <div className="flex items-center gap-3 mb-8">
                                                < ShieldCheck size={20} className="text-blue-500" />
                                                <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">{t('projects.requirements')}</h4>
                                            </div>
                                            <ul className="space-y-4">
                                                {((locale === 'az' && selectedProject.requirementsAz) ? selectedProject.requirementsAz : selectedProject.requirements || '')
                                                    .split('\n').filter(Boolean).map((item, i) => (
                                                        <li key={i} className="text-sm text-slate-700 font-bold flex gap-3 leading-relaxed">
                                                            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                                                            {item.trim()}
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar Info Card */}
                                <div className="space-y-8">
                                    <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                                        <div className="space-y-10">
                                            <div>
                                                <div className="text-[10px] uppercase font-black text-slate-400 mb-4 tracking-[0.2em]">Location</div>
                                                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                                    <MapPin size={22} className="text-emerald-500" />
                                                    <span className="font-bold text-slate-800 text-sm truncate">{(locale === 'az' && selectedProject.locationAz) ? selectedProject.locationAz : selectedProject.location || 'Azerbaijan'}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-[10px] uppercase font-black text-slate-400 mb-4 tracking-[0.2em]">Required Skills</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProject.requiredSkills.map(skill => (
                                                        <span key={skill} className="px-4 py-2 bg-white text-emerald-600 font-bold rounded-xl border border-emerald-100 text-[10px] uppercase tracking-widest shadow-sm">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-slate-200">
                                                <button
                                                    onClick={() => handleApply(selectedProject.id)}
                                                    disabled={!!applying}
                                                    className="btn-primary w-full !py-5 !rounded-2xl !text-sm group/apply shadow-lg"
                                                >
                                                    {applying === selectedProject.id ? (
                                                        <Loader2 size={18} className="animate-spin" />
                                                    ) : (
                                                        <>
                                                            <span>Join Mission</span>
                                                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                                <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                                <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                                                    {t('projects.eligibility_notice')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

