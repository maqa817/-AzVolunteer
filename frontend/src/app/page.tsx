'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import { ArrowRight, Users, FolderOpen, MapPin, Shield, Atom, Globe, Leaf, Wind, Sun, Heart } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

export default function HomePage() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { value: '5,000+', label: t('hero.stat_volunteers'), icon: <Users size={18} className="text-green-400" /> },
    { value: '12+', label: t('hero.stat_projects'), icon: <FolderOpen size={18} className="text-lime-400" /> },
    { value: '6+', label: t('hero.stat_cities'), icon: <MapPin size={18} className="text-emerald-400" /> },
  ];

  const features = [
    {
      icon: <Wind size={24} />,
      title: t('features.stem_title'),
      desc: t('features.stem_desc'),
      color: 'from-green-600 to-emerald-500',
    },
    {
      icon: <Shield size={24} />,
      title: t('features.secure_title'),
      desc: t('features.secure_desc'),
      color: 'from-emerald-600 to-teal-500',
    },
    {
      icon: <Sun size={24} />,
      title: t('features.national_title'),
      desc: t('features.national_desc'),
      color: 'from-lime-600 to-green-500',
    },
    {
      icon: <Heart size={24} />,
      title: t('features.management_title'),
      desc: t('features.management_desc'),
      color: 'from-green-700 to-emerald-600',
    },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a1a0f] selection:bg-green-500/30 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background Layers */}
        <div className="absolute inset-0 z-0">
          {/* Deep Forest Glow */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-green-900/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-900/20 blur-[100px] rounded-full animate-pulse delay-700" />

          {/* Fireflies / Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-lime-400 rounded-full blur-[1px] animate-float opacity-20"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${3 + Math.random() * 5}s`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>

          {/* Tree Silhouettes SVG Layer */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-1">
            <svg className="relative block w-[200%] h-[300px] md:h-[400px] fill-[#0f2318] opacity-40 animate-slide-right-slow" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0 C150,110 350,110 500,0 C650,110 850,110 1000,0 L1000,120 L0,120 Z"></path>
              <circle cx="100" cy="40" r="30" />
              <circle cx="300" cy="60" r="40" />
              <circle cx="500" cy="30" r="25" />
              <circle cx="700" cy="50" r="35" />
              <circle cx="900" cy="70" r="50" />
              <circle cx="1100" cy="40" r="30" />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-1">
            <svg className="relative block w-[200%] h-[200px] md:h-[300px] fill-[#132b1a] opacity-80 animate-slide-left-slow" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0 C200,100 400,100 600,0 C800,100 1000,100 1200,0 L1200,120 L0,120 Z"></path>
              <rect x="50" y="20" width="2" height="100" />
              <rect x="250" y="40" width="3" height="100" />
              <rect x="450" y="10" width="2" height="110" />
              <rect x="650" y="30" width="3" height="100" />
              <rect x="850" y="50" width="2" height="90" />
              <rect x="1050" y="20" width="3" height="110" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-[-5vh]">
          {/* Badge */}
          <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
            {t('hero.badge')}
          </div>

          {/* Title */}
          <h1 className="animate-slide-up delay-100 text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] max-w-4xl mx-auto">
            {t('hero.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-lime-300 to-emerald-400">
              {t('hero.titleHighlight')}
            </span>
          </h1>

          <p className="animate-slide-up delay-200 text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium italic opacity-80">
            {t('hero.subtitle')}
          </p>

          {/* CTAs */}
          <div className="animate-slide-up delay-300 flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link href="/auth/register" className="btn-primary group !text-lg !px-10 !py-5">
              <Leaf size={22} className="group-hover:rotate-12 transition-transform" />
              {t('hero.cta_primary')}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform opacity-50" />
            </Link>
            <Link href="/projects" className="btn-secondary !text-lg !px-10 !py-5 backdrop-blur-md">
              {t('hero.cta_secondary')}
            </Link>
          </div>

          {/* Counters / Stats */}
          <div className="animate-fade-in delay-300 grid grid-cols-3 gap-8 md:gap-16 max-w-2xl mx-auto p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="mb-2 flex justify-center scale-90 group-hover:scale-110 transition-transform duration-500">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-black text-white mb-1 group-hover:text-green-400 transition-colors uppercase tracking-widest">{stat.value}</div>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-400 transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-[0.25em] mb-4">
              Explore Our Vision
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              {t('features.title')} <span className="text-green-500">{t('features.titleHighlight')}</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="card group hover:shadow-green-500/5 border-white/5 bg-emerald-950/20"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-6 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-lg`}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium italic opacity-80">{f.desc}</p>
                <div className="mt-8 h-1 w-0 bg-gradient-to-r from-green-500 to-lime-400 group-hover:w-full transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 mb-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="card bg-gradient-to-br from-[#0f2318] to-[#0a1a0f] border-green-500/20 py-24 px-8 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-600/10 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-lime-600/10 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000" />

            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
              {t('cta_banner.title')}
            </h2>
            <p className="text-slate-400 mb-12 text-xl max-w-2xl mx-auto leading-relaxed italic">
              {t('cta_banner.subtitle')}
            </p>
            <Link href="/auth/register" className="btn-primary !text-lg !px-12 !py-5 shadow-2xl shadow-green-500/20 group">
              <Leaf size={24} className="group-hover:animate-bounce" />
              {t('cta_banner.button')}
              <ArrowRight size={22} className="opacity-40 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-16 bg-[#07130a]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-600 to-lime-500 flex items-center justify-center text-white font-black text-xs">
                <Leaf size={14} />
              </div>
              <span className="font-display font-black text-xl text-white">
                Az<span className="text-green-500">Volunteer</span>
              </span>
            </Link>
            <p className="text-slate-600 text-xs font-mono tracking-widest uppercase">
              {t('footer.copyright')}
            </p>
          </div>

          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            <Link href="/projects" className="hover:text-green-400 transition-colors">Projects</Link>
            <Link href="/auth/login" className="hover:text-green-400 transition-colors">Portal</Link>
            <a href="#" className="hover:text-green-400 transition-colors">Twitter</a>
            <a href="#" className="hover:text-green-400 transition-colors">Instagram</a>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes slide-right-slow {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @keyframes slide-left-slow {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-slide-right-slow {
          animation: slide-right-slow 40s linear infinite;
        }
        .animate-slide-left-slow {
          animation: slide-left-slow 35s linear infinite;
        }
      `}</style>
    </div>
  );
}
