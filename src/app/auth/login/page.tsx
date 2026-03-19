'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn, Leaf, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../lib/auth-context';
import { useI18n } from '../../../hooks/useI18n';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(t('auth.welcome_msg'));
      // Use window.location.href to force a full page refresh/state reset as requested by user
      window.location.href = user.role === 'admin' ? '/admin' : '/dashboard';
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t('auth.login_fail');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1a0f] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Decorative Forest Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-800/10 blur-[130px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-800/10 blur-[130px] rounded-full animate-pulse delay-700" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-600 to-lime-500 flex items-center justify-center text-white shadow-2xl shadow-green-500/20 group-hover:rotate-12 transition-transform duration-500">
              <Leaf size={24} className="fill-white/10" />
            </div>
            <span className="font-display font-black text-2xl text-white tracking-tighter">
              Az<span className="text-green-500">Volunteer</span>
            </span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{t('auth.login_title')}</h1>
          <p className="text-slate-500 font-medium italic text-sm">
            {t('auth.login_subtitle')}
          </p>
        </div>

        <div className="card p-8 md:p-10 bg-emerald-950/20 backdrop-blur-3xl border-white/5 rounded-[40px] shadow-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-2 ml-4">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="input-field h-14 !rounded-2xl !bg-black/20 !border-white/5 px-6 focus:!bg-black/40 transition-all font-medium text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-2 ml-4">
                {t('auth.password')}
              </label>
              <div className="relative group">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field h-14 !rounded-2xl !bg-black/20 !border-white/5 px-6 pr-14 focus:!bg-black/40 transition-all font-medium text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-green-400 transition-colors p-2"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-14 !rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-xs shadow-3xl shadow-green-500/10 group overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center gap-3">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                    {t('auth.submit_login')}
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </button>
          </form>

          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mt-8">
            {t('auth.no_account')}{' '}
            <Link href="/auth/register" className="text-green-500 hover:text-lime-400 transition-colors underline-offset-4 hover:underline">
              {t('nav.register')}
            </Link>
          </p>
        </div>

        {/* Security Feature Footer */}
        <div className="mt-10 flex items-center justify-center gap-6 opacity-30">
          <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-500">
            <ShieldCheck size={12} /> Secure Auth
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-700" />
          <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-500">
            <Sparkles size={12} /> Encrypted Session
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .shadow-3xl {
          box-shadow: 0 32px 64px -16px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
