'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Leaf, LogOut, LayoutDashboard } from 'lucide-react';
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-2xl border-b border-slate-100/80 py-3 shadow-sm shadow-slate-100' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-105" onClick={closeMenu}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
              <Leaf size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Az<span className="text-emerald-500">Volunteer</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
                {t('nav.home')}
              </Link>
              <Link href="/projects" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
                {t('nav.projects')}
              </Link>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => changeLocale('az')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${locale === 'az' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                AZ
              </button>
              <button
                onClick={() => changeLocale('en')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${locale === 'en' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                EN
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-5 py-2.5 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors"
                >
                  <LayoutDashboard size={14} />
                  {t('nav.dashboard')}
                </Link>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all"
                  title={t('nav.logout')}
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Link href="/auth/login" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
                  {t('nav.login')}
                </Link>
                <Link href="/auth/register" className="btn-primary !text-xs !px-6 !py-2.5 !rounded-xl !shadow-md">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-white z-[100] flex flex-col overflow-y-auto">
          <div className="flex flex-col h-full px-6 pt-8 pb-10">
            {/* Nav links */}
            <div className="flex flex-col gap-2 mb-8">
              <Link
                href="/"
                className="flex items-center text-2xl font-bold text-slate-900 py-4 border-b border-slate-50"
                onClick={closeMenu}
              >
                {t('nav.home')}
              </Link>
              <Link
                href="/projects"
                className="flex items-center text-2xl font-bold text-slate-900 py-4 border-b border-slate-50"
                onClick={closeMenu}
              >
                {t('nav.projects')}
              </Link>
            </div>

            {/* Language switcher */}
            <div className="flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-8">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Language</span>
              <div className="flex gap-2">
                <button
                  onClick={() => { changeLocale('az'); closeMenu(); }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${locale === 'az' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'}`}
                >
                  AZ
                </button>
                <button
                  onClick={() => { changeLocale('en'); closeMenu(); }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${locale === 'en' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'}`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Auth buttons */}
            <div className="mt-auto space-y-3">
              {user ? (
                <>
                  <Link
                    href={user.role === 'admin' ? '/admin' : '/dashboard'}
                    className="btn-primary w-full !py-4 !rounded-2xl"
                    onClick={closeMenu}
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <button
                    onClick={() => { logout(); closeMenu(); }}
                    className="w-full py-4 text-sm font-bold text-rose-600 bg-rose-50 rounded-2xl border border-rose-100 hover:bg-rose-100 transition-colors"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/register"
                    className="btn-primary w-full !py-4 !rounded-2xl"
                    onClick={closeMenu}
                  >
                    {t('nav.register')}
                  </Link>
                  <Link
                    href="/auth/login"
                    className="block text-center py-4 text-sm font-bold text-slate-600 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors"
                    onClick={closeMenu}
                  >
                    {t('nav.login')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
