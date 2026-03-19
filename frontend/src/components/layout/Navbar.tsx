'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Leaf, User, LogOut, LayoutDashboard } from 'lucide-react';
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-emerald-950/90 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative">
            <div className="absolute -inset-2 bg-green-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-600 to-lime-500 flex items-center justify-center text-white shadow-lg shadow-green-900/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <Leaf size={20} className="fill-white/20" />
            </div>
            <span className="font-display font-black text-2xl text-white tracking-tight">
              Az<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-300">Volunteer</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-sm font-bold text-slate-300 hover:text-white transition-all hover:scale-105 active:scale-95">
                {t('nav.home')}
              </Link>
              <Link href="/projects" className="text-sm font-bold text-slate-300 hover:text-white transition-all hover:scale-105 active:scale-95">
                {t('nav.projects')}
              </Link>
            </div>

            {/* Language switcher pill */}
            <div className="relative flex items-center p-1 bg-black/40 backdrop-blur-md rounded-full border border-white/5 w-[100px] h-9">
              <div
                className={`absolute inset-1 w-[46px] bg-gradient-to-br from-green-600 to-lime-500 rounded-full transition-all duration-500 shadow-lg shadow-green-500/20 ${locale === 'en' ? 'translate-x-[44px]' : 'translate-x-0'}`}
              />
              <button
                onClick={() => changeLocale('az')}
                className={`relative flex-1 text-[10px] font-black tracking-widest transition-colors duration-500 ${locale === 'az' ? 'text-white' : 'text-slate-500 hover:text-slate-400'}`}
              >
                AZ
              </button>
              <button
                onClick={() => changeLocale('en')}
                className={`relative flex-1 text-[10px] font-black tracking-widest transition-colors duration-500 ${locale === 'en' ? 'text-white' : 'text-slate-500 hover:text-slate-400'}`}
              >
                EN
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-green-400 hover:text-green-300 transition-colors bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20"
                >
                  <LayoutDashboard size={14} />
                  {t('nav.dashboard')}
                </Link>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all active:scale-90"
                  title={t('nav.logout')}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link href="/auth/register" className="btn-primary !text-xs !px-6 !py-2.5 uppercase tracking-widest">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white active:scale-90 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-emerald-950/98 backdrop-blur-2xl px-6 py-8 space-y-6 animate-fade-in shadow-2xl">
          <Link href="/" className="block text-xl font-bold text-slate-300 hover:text-white" onClick={() => setMenuOpen(false)}>
            {t('nav.home')}
          </Link>
          <Link href="/projects" className="block text-xl font-bold text-slate-300 hover:text-white" onClick={() => setMenuOpen(false)}>
            {t('nav.projects')}
          </Link>

          <div className="h-px bg-white/5" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Language</span>
            <div className="flex gap-2">
              <button
                onClick={() => { changeLocale('az'); setMenuOpen(false); }}
                className={`w-12 h-8 rounded-lg text-[10px] font-black ${locale === 'az' ? 'bg-green-600 text-white' : 'bg-white/5 text-slate-500'}`}
              >
                AZ
              </button>
              <button
                onClick={() => { changeLocale('en'); setMenuOpen(false); }}
                className={`w-12 h-8 rounded-lg text-[10px] font-black ${locale === 'en' ? 'bg-green-600 text-white' : 'bg-white/5 text-slate-500'}`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            {user ? (
              <>
                <Link href="/dashboard" className="btn-primary w-full" onClick={() => setMenuOpen(false)}>
                  {t('nav.dashboard')}
                </Link>
                <button onClick={logout} className="w-full py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-rose-400 transition-colors">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/register" className="btn-primary w-full" onClick={() => setMenuOpen(false)}>
                  {t('nav.register')}
                </Link>
                <Link href="/auth/login" className="block text-center text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white" onClick={() => setMenuOpen(false)}>
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
