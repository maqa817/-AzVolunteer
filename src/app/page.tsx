'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import {
  ArrowRight, Users, FolderOpen, MapPin, Shield, Atom,
  Globe, Heart, Sparkles, MoveRight, CheckCircle,
  Star, Quote, Leaf
} from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import Footer from '../components/layout/Footer';

export default function HomePage() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { value: '5,000+', label: t('hero.stat_volunteers'), icon: <Users size={22} className="text-emerald-500" /> },
    { value: '18+',    label: t('hero.stat_projects'),   icon: <FolderOpen size={22} className="text-emerald-500" /> },
    { value: '12+',    label: t('hero.stat_cities'),     icon: <MapPin size={22} className="text-emerald-500" /> },
  ];

  const features = [
    {
      icon: <Atom size={24} />,
      title: t('features.stem_title'),
      desc: t('features.stem_desc'),
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      border: 'border-emerald-100',
    },
    {
      icon: <Shield size={24} />,
      title: t('features.secure_title'),
      desc: t('features.secure_desc'),
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      border: 'border-blue-100',
    },
    {
      icon: <Globe size={24} />,
      title: t('features.national_title'),
      desc: t('features.national_desc'),
      bg: 'bg-teal-50',
      iconColor: 'text-teal-600',
      border: 'border-teal-100',
    },
    {
      icon: <Heart size={24} />,
      title: t('features.management_title'),
      desc: t('features.management_desc'),
      bg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      border: 'border-rose-100',
    },
  ];

  const testimonials = [
    {
      name: t('testimonials_section.user1_name'),
      role: t('testimonials_section.user1_role'),
      text: t('testimonials_section.user1_text'),
      avatar: 'AH',
      color: 'bg-emerald-500',
    },
    {
      name: t('testimonials_section.user2_name'),
      role: t('testimonials_section.user2_role'),
      text: t('testimonials_section.user2_text'),
      avatar: 'TƏ',
      color: 'bg-blue-500',
    },
    {
      name: t('testimonials_section.user3_name'),
      role: t('testimonials_section.user3_role'),
      text: t('testimonials_section.user3_text'),
      avatar: 'LM',
      color: 'bg-teal-500',
    },
  ];

  const howItWorks = [
    { step: '01', title: t('how_it_works.step1_title'), desc: t('how_it_works.step1_desc'), icon: <Users size={20} /> },
    { step: '02', title: t('how_it_works.step2_title'), desc: t('how_it_works.step2_desc'), icon: <FolderOpen size={20} /> },
    { step: '03', title: t('how_it_works.step3_title'), desc: t('how_it_works.step3_desc'), icon: <CheckCircle size={20} /> },
    { step: '04', title: t('how_it_works.step4_title'), desc: t('how_it_works.step4_desc'), icon: <Star size={20} /> },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-500/20 overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] bg-emerald-200/25 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-200/20 blur-[100px] rounded-full" />
          <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-teal-100/30 blur-[80px] rounded-full" />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`, backgroundSize: '36px 36px' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: text */}
            <div className="text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm text-emerald-700 text-[11px] font-bold uppercase tracking-[0.15em] mb-8">
                <Sparkles size={13} className="animate-pulse text-emerald-500" />
                {t('hero.badge')}
              </div>

              <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold text-slate-900 mb-6 leading-[1.05] tracking-tight">
                {t('hero.title')}{' '}
                <span className="text-gradient">{t('hero.titleHighlight')}</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link href="/auth/register" className="btn-primary group !py-4 !px-10 !rounded-2xl !text-[15px]">
                  <span>{t('hero.cta_primary')}</span>
                  <MoveRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/projects" className="btn-secondary !py-4 !px-10 !rounded-2xl !text-[15px]">
                  {t('hero.cta_secondary')}
                </Link>
              </div>

              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {['bg-emerald-400','bg-teal-500','bg-blue-500','bg-cyan-500','bg-indigo-500'].map((c,i) => (
                    <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-sm`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[0,1,2,3,4].map(i => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">{t('hero.social_proof')}</p>
                </div>
              </div>
            </div>

            {/* Right: image mosaic */}
            <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/10 w-full aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80&auto=format&fit=crop"
                  alt="Volunteers"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <Users size={18} />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-slate-900 leading-none">5,000+</div>
                  <div className="text-[11px] text-slate-400 font-semibold mt-0.5">{t('hero.stat_volunteers_small')}</div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3" style={{ animationDelay: '1s' }}>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                  <FolderOpen size={18} />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-slate-900 leading-none">18+</div>
                  <div className="text-[11px] text-slate-400 font-semibold mt-0.5">{t('hero.stat_projects_small')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-3 gap-4 bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/40 border border-slate-100/80">
            {stats.map((stat, i) => (
              <div key={i} className={`text-center px-4 ${i !== stats.length - 1 ? 'border-r border-slate-100' : ''}`}>
                <div className="mb-2 flex justify-center">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-white py-24 border-t border-slate-100">
        <div className="section-container !py-0">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-bold uppercase tracking-[0.2em] mb-5">
              <CheckCircle size={13} />
              {t('how_it_works.badge')}
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {t('how_it_works.title')}<span className="text-gradient">{t('how_it_works.titleHighlight')}</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg font-medium">
              {t('how_it_works.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative group p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-black text-emerald-100 select-none">{step.step}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-24 bg-slate-50" id="about">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-[0.2em] mb-6">
                <Globe size={13} />
                {t('mission_section.badge')}
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                {t('mission_section.title')}<span className="text-gradient">{t('mission_section.titleHighlight')}</span>{t('mission_section.titleSuffix')}
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">
                {t('mission_section.desc')}
              </p>
              <ul className="space-y-3 mb-10">
                {[
                  t('mission_section.item1'),
                  t('mission_section.item2'),
                  t('mission_section.item3'),
                  t('mission_section.item4')
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={13} className="text-emerald-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="btn-primary !py-4 !px-10 !rounded-2xl group shadow-lg">
                <span>{t('mission_section.cta')}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
                  <img src="https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=400&q=80&auto=format&fit=crop" alt="Volunteers" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square shadow-lg">
                  <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80&auto=format&fit=crop" alt="Team" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="rounded-2xl overflow-hidden aspect-square shadow-lg">
                  <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&q=80&auto=format&fit=crop" alt="Environment" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
                  <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80&auto=format&fit=crop" alt="Action" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-white py-24 border-t border-slate-100">
        <div className="section-container !py-0">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-bold uppercase tracking-[0.2em] mb-5">
              <Sparkles size={13} />
              Platform Features
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {t('features.title')} <span className="text-emerald-500">{t('features.titleHighlight')}</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg font-medium">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card group hover:border-emerald-200 !p-7">
                <div className={`w-14 h-14 rounded-2xl ${f.bg} ${f.iconColor} border ${f.border} flex items-center justify-center mb-6`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-3 leading-snug">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="section-container !py-0">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[11px] font-bold uppercase tracking-[0.2em] mb-5">
              <Star size={13} className="fill-amber-500" />
              {t('testimonials_section.badge')}
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              {t('testimonials_section.title')}<span className="text-gradient">{t('testimonials_section.titleHighlight')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((tLoc, i) => (
              <div key={i} className="card !p-7 flex flex-col gap-5 hover:border-slate-200">
                <Quote size={28} className="text-emerald-200" />
                <p className="text-slate-600 leading-relaxed text-base font-medium flex-1">{tLoc.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                  <div className={`w-10 h-10 rounded-full ${tLoc.color} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 shadow-md`}>
                    {tLoc.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{tLoc.name}</div>
                    <div className="text-xs text-slate-400 font-medium">{tLoc.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-5">
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 p-12 md:p-20 text-center">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/15 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                {t('cta_banner.title')}
              </h2>
              <p className="text-slate-400 mb-10 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                {t('cta_banner.subtitle')}
              </p>
              <Link href="/auth/register" className="btn-primary !py-5 !px-14 !text-base !rounded-2xl shadow-xl shadow-emerald-900/40 group">
                <span>{t('cta_banner.button')}</span>
                <MoveRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
