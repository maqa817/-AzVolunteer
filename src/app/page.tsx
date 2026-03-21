'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/layout/Navbar';
import {
  ArrowRight, Users, FolderOpen, MapPin, Shield, Atom,
  Globe, Leaf, Heart, Sparkles, MoveRight, CheckCircle,
  Star, Quote,
} from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

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
      name: 'Aynur Hüseynova',
      role: 'Kimya Mühəndisi',
      text: 'AzVolunteer sayəsində öz peşəmi cəmiyyətin xeyrinə istifadə edə bildim. Platforma həm peşəkar, həm də ürəkaçan.',
      avatar: 'AH',
      color: 'bg-emerald-500',
    },
    {
      name: 'Tural Əliyev',
      role: 'Proqram Mühəndisi',
      text: 'Qeydiyyat prosesi çox sadədir. Layihələr ciddi və məzmunludur. Könüllü kimi özümü həqiqətən dəyərli hiss edirəm.',
      avatar: 'TƏ',
      color: 'bg-blue-500',
    },
    {
      name: 'Leyla Mustafayeva',
      role: 'Ətraf Mühit Mütəxəssisi',
      text: '12+ şəhərdə aktiv layihələr var. Bu genişlik platformanın ciddiliyini göstərir. Tövsiyyə edirəm!',
      avatar: 'LM',
      color: 'bg-teal-500',
    },
  ];

  const howItWorks = [
    { step: '01', title: 'Qeydiyyatdan keç', desc: 'Qısa anket doldurun, bacarıq və maraqlarınızı bildirin.', icon: <Users size={20} /> },
    { step: '02', title: 'Layihə seç', desc: 'Sizə uyğun onlarla aktiv layihəni araşdırın.', icon: <FolderOpen size={20} /> },
    { step: '03', title: 'Müraciət et', desc: 'Bir klik ilə müraciət edin, cavabı gözləyin.', icon: <CheckCircle size={20} /> },
    { step: '04', title: 'Fərq yarat', desc: 'Cəmiyyətə real töhfə verin, certificate qazanın.', icon: <Star size={20} /> },
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
          {/* dot grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`, backgroundSize: '36px 36px' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: text */}
            <div className="text-center lg:text-left animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm text-emerald-700 text-[11px] font-bold uppercase tracking-[0.15em] mb-8">
                <Sparkles size={13} className="animate-pulse text-emerald-500" />
                {t('hero.badge')}
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold text-slate-900 mb-6 leading-[1.05] tracking-tight">
                {t('hero.title')}{' '}
                <span className="text-gradient">{t('hero.titleHighlight')}</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
                {t('hero.subtitle')}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link href="/auth/register" className="btn-primary group !py-4 !px-10 !rounded-2xl !text-[15px]">
                  <span>{t('hero.cta_primary')}</span>
                  <MoveRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/projects" className="btn-secondary !py-4 !px-10 !rounded-2xl !text-[15px]">
                  {t('hero.cta_secondary')}
                </Link>
              </div>

              {/* Social proof */}
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
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">5,000+ könüllü platforma güvənir</p>
                </div>
              </div>
            </div>

            {/* Right: image mosaic */}
            <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/10 w-full aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80&auto=format&fit=crop"
                  alt="Volunteers working together"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
              </div>

              {/* Floating stat cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <Users size={18} />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-slate-900 leading-none">5,000+</div>
                  <div className="text-[11px] text-slate-400 font-semibold mt-0.5">Aktiv könüllü</div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3" style={{ animationDelay: '1s' }}>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                  <FolderOpen size={18} />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-slate-900 leading-none">18+</div>
                  <div className="text-[11px] text-slate-400 font-semibold mt-0.5">Aktiv layihə</div>
                </div>
              </div>

              {/* Small grid image */}
              <div className="absolute bottom-12 -right-8 w-32 h-32 rounded-2xl overflow-hidden shadow-xl border-2 border-white">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=300&q=80&auto=format&fit=crop"
                  alt="Community"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Stats bar — mobile visible */}
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
              Necə işləyir
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Sadə, Sürətli, <span className="text-gradient">Effektiv</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg font-medium">
              4 addımda könüllü kimi fəaliyyətə başla.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative group">
                {/* connector line */}
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(100%-0px)] w-full h-px bg-gradient-to-r from-emerald-200 to-slate-100 z-0" />
                )}
                <div className="relative z-10 bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300 group-hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                      {step.icon}
                    </div>
                    <span className="text-2xl font-black text-emerald-100 select-none">{step.step}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMAGE SECTION ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-[0.2em] mb-6">
                <Globe size={13} />
                Missiyamız
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                Azərbaycanın <span className="text-gradient">STEM gücü</span> ilə gələcəyini quran gənclər
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">
                AzVolunteer, elm, texnologiya, mühəndislik və riyaziyyat sahəsindəki könüllüləri ölkəmizin inkişafına töhfə verən layihələrlə birləşdirən milli platformadır.
              </p>
              <ul className="space-y-3 mb-10">
                {[
                  'Sertifikat və tövsiyyə məktubu qazanın',
                  'Peşəkar komanda ilə işləyin',
                  'Real dünya problemlərini həll edin',
                  'CV-nizi zənginləşdirin',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={13} className="text-emerald-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="btn-primary !py-4 !px-10 !rounded-2xl group">
                <span>İndi qoşul</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=400&q=80&auto=format&fit=crop"
                    alt="Young volunteers"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80&auto=format&fit=crop"
                    alt="Team collaboration"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="rounded-2xl overflow-hidden aspect-square shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&q=80&auto=format&fit=crop"
                    alt="Science volunteers"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80&auto=format&fit=crop"
                    alt="Environment"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
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
                <div className={`w-14 h-14 rounded-2xl ${f.bg} ${f.iconColor} border ${f.border} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
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
              Könüllülərimiz deyir
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Real <span className="text-gradient">Təcrübələr</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card !p-7 flex flex-col gap-5 hover:border-slate-200">
                <Quote size={28} className="text-emerald-200" />
                <p className="text-slate-600 leading-relaxed text-base font-medium flex-1">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                  <div className={`w-10 h-10 rounded-full ${t.color} text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-md`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-400 font-medium">{t.role}</div>
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
            {/* bg glows */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/15 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
            {/* dot pattern */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
            />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                {t('cta_banner.title')}
              </h2>
              <p className="text-slate-400 mb-10 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                {t('cta_banner.subtitle')}
              </p>
              <Link href="/auth/register" className="btn-primary !py-5 !px-14 !text-base !rounded-2xl shadow-2xl shadow-emerald-900/30 group">
                <span>{t('cta_banner.button')}</span>
                <MoveRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white pt-20 pb-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                  <Leaf size={18} />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900">
                  Az<span className="text-emerald-500">Volunteer</span>
                </span>
              </Link>
              <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-xs">
                Azərbaycanın milli könüllülük və texniki inkişaf platforması. Birlikdə daha güclüyük.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Platform</span>
              <Link href="/projects" className="text-sm text-slate-600 hover:text-emerald-600 font-semibold transition-colors">Layihələr</Link>
              <Link href="/auth/register" className="text-sm text-slate-600 hover:text-emerald-600 font-semibold transition-colors">Qeydiyyat</Link>
              <Link href="/auth/login" className="text-sm text-slate-600 hover:text-emerald-600 font-semibold transition-colors">Giriş</Link>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Sosial</span>
              <a href="#" className="text-sm text-slate-600 hover:text-emerald-600 font-semibold transition-colors">LinkedIn</a>
              <a href="#" className="text-sm text-slate-600 hover:text-emerald-600 font-semibold transition-colors">Instagram</a>
              <a href="#" className="text-sm text-slate-600 hover:text-emerald-600 font-semibold transition-colors">Haqqımızda</a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-100">
            <p className="text-slate-400 font-medium text-sm">{t('footer.copyright')}</p>
            <div className="flex gap-6 text-sm font-semibold text-slate-400">
              <a href="#" className="hover:text-emerald-600 transition-colors">Şərtlər</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Məxfilik</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
