'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import { ArrowRight, Users, FolderOpen, MapPin, Shield, Atom, Globe, Leaf, Wind, Sun, Heart, Sparkles, MoveRight } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

export default function HomePage() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { value: '5,000+', label: t('hero.stat_volunteers'), icon: <Users size={20} className="text-emerald-500" /> },
    { value: '18+', label: t('hero.stat_projects'), icon: <FolderOpen size={20} className="text-emerald-500" /> },
    { value: '12+', label: t('hero.stat_cities'), icon: <MapPin size={20} className="text-emerald-500" /> },
  ];

  const features = [
    {
      icon: <Atom size={28} />,
      title: t('features.stem_title'),
      desc: t('features.stem_desc'),
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      icon: <Shield size={28} />,
      title: t('features.secure_title'),
      desc: t('features.secure_desc'),
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: <Globe size={28} />,
      title: t('features.national_title'),
      desc: t('features.national_desc'),
      bg: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
    {
      icon: <Heart size={28} />,
      title: t('features.management_title'),
      desc: t('features.management_desc'),
      bg: 'bg-rose-50',
      iconColor: 'text-rose-600',
    },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-500/20 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-20 overflow-hidden">
        {/* Modern Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-emerald-100/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/20 blur-[100px] rounded-full" />
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center animate-fade-in translate-y-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm text-emerald-600 text-[11px] font-bold uppercase tracking-[0.15em] mb-10">
            <Sparkles size={14} className="animate-pulse" />
            {t('hero.badge')}
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-[5.5rem] font-extrabold text-slate-900 mb-8 tracking-[-0.03em] leading-[1] max-w-5xl mx-auto">
            {t('hero.title')}{' '}
            <span className="text-gradient">
              {t('hero.titleHighlight')}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-14 leading-relaxed font-medium">
            {t('hero.subtitle')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-24">
            <Link href="/auth/register" className="btn-primary group !py-5 !px-12">
              <span>{t('hero.cta_primary')}</span>
              <MoveRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/projects" className="btn-secondary !py-5 !px-12">
              {t('hero.cta_secondary')}
            </Link>
          </div>

          {/* Counter Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 max-w-4xl mx-auto p-12 rounded-[2.5rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50">
            {stats.map((stat, i) => (
              <div key={i} className={`text-center px-12 ${i !== stats.length - 1 ? 'md:border-r border-slate-100' : ''}`}>
                <div className="mb-4 flex justify-center">{stat.icon}</div>
                <div className="text-4xl font-extrabold text-slate-900 mb-2 truncate">{stat.value}</div>
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 px-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-32">
        <div className="section-container">
          <div className="text-center mb-24">
            <div className="inline-block px-5 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-[0.25em] mb-6">
              Platform Features
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-8">
              {t('features.title')} <span className="text-emerald-500">{t('features.titleHighlight')}</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="card group border-slate-100"
              >
                <div
                  className={`w-20 h-20 rounded-3xl ${f.bg} ${f.iconColor} flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500`}
                >
                  {f.icon}
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-4">{f.title}</h3>
                <p className="text-base text-slate-500 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="card bg-slate-900 border-none py-28 px-8 text-center relative overflow-hidden group !rounded-[3rem]">
            {/* Visual elements for dark card */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-10 tracking-tight leading-[1.1]">
                {t('cta_banner.title')}
              </h2>
              <p className="text-slate-400 mb-14 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
                {t('cta_banner.subtitle')}
              </p>
              <Link href="/auth/register" className="btn-primary !py-6 !px-16 !text-lg !rounded-3xl shadow-xl shadow-emerald-900/40">
                <span>{t('cta_banner.button')}</span>
                <MoveRight size={24} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-24 pb-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-20">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black">
                  <Leaf size={20} />
                </div>
                <span className="font-bold text-2xl tracking-tighter text-slate-900">
                  Az<span className="text-emerald-500">Volunteer</span>
                </span>
              </Link>
              <p className="text-slate-500 max-w-xs font-medium">
                Azərbaycanın milli könüllülük və texniki inkişaf platforması.
              </p>
            </div>

            <div className="flex flex-wrap gap-12">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Platform</span>
                <Link href="/projects" className="text-slate-600 hover:text-emerald-600 font-bold transition-colors">Layihələr</Link>
                <Link href="/auth/register" className="text-slate-600 hover:text-emerald-600 font-bold transition-colors">Qeydiyyat</Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">İttifaq</span>
                <Link href="/auth/login" className="text-slate-600 hover:text-emerald-600 font-bold transition-colors">Giriş</Link>
                <a href="#" className="text-slate-600 hover:text-emerald-600 font-bold transition-colors">Haqqımızda</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sosial</span>
                <a href="#" className="text-slate-600 hover:text-emerald-600 font-bold transition-colors">LinkedIn</a>
                <a href="#" className="text-slate-600 hover:text-emerald-600 font-bold transition-colors">Instagram</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-slate-50">
            <p className="text-slate-400 font-medium text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex gap-8 text-sm font-bold text-slate-500">
              <a href="#" className="hover:text-emerald-600 transition-colors">Şərtlər</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Məxfilik</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
