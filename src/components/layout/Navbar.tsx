'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Leaf, User, LogOut, LayoutDashboard, Globe } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { useI18n } from '../../hooks/useI18n';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, locale, changeLocale } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-2xl border-b border-slate-100 py-3 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
              <Leaf size={20} />
            </div>
            <span className="font-bold text-2xl tracking-tighter text-slate-900">
              Az<span className="text-emerald-500">Volunteer</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-12">
            <div className="flex items-center gap-10">
              <Link href="/" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">
                {t('nav.home')}
              </Link>
              <Link href="/projects" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">
                {t('nav.projects')}
              </Link>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/50">
              <button
                onClick={() => changeLocale('az')}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${locale === 'az' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                AZ
              </button>
              <button
                onClick={() => changeLocale('en')}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${locale === 'en' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                EN
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-5 py-2.5 rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-colors"
                >
                  <LayoutDashboard size={14} />
                  {t('nav.dashboard')}
                </Link>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                  title={t('nav.logout')}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link
                  href="/auth/login"
                  className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link href="/auth/register" className="btn-primary !text-xs !px-8 !py-3 !rounded-2xl">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-3 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-white z-[100] px-6 py-12 flex flex-col gap-10 animate-fade-in">
          <div className="flex flex-col gap-6">
            <Link href="/" className="text-3xl font-extrabold text-slate-900" onClick={() => setMenuOpen(false)}>
              {t('nav.home')}
            </Link>
            <Link href="/projects" className="text-3xl font-extrabold text-slate-900" onClick={() => setMenuOpen(false)}>
              {t('nav.projects')}
            </Link>
          </div>

          <div className="h-px bg-slate-100" />

          <div className="flex items-center justify-between bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Language</span>
            <div className="flex gap-2">
              <button
                onClick={() => { changeLocale('az'); setMenuOpen(false); }}
                className={`px-5 py-3 rounded-2xl text-xs font-bold ${locale === 'az' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500 border border-slate-100'}`}
              >
                AZ
              </button>
              <button
                onClick={() => { changeLocale('en'); setMenuOpen(false); }}
                className={`px-5 py-3 rounded-2xl text-xs font-bold ${locale === 'en' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500 border border-slate-100'}`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            {user ? (
              <>
                <Link href="/dashboard" className="btn-primary w-full !py-5" onClick={() => setMenuOpen(false)}>
                  {t('nav.dashboard')}
                </Link>
                <button onClick={logout} className="w-full py-5 text-sm font-bold text-rose-600 bg-rose-50 rounded-2xl">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/register" className="btn-primary w-full !py-5" onClick={() => setMenuOpen(false)}>
                  {t('nav.register')}
                </Link>
                <Link href="/auth/login" className="block text-center py-5 text-sm font-bold text-slate-600" onClick={() => setMenuOpen(false)}>
                  {t('nav.login')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
