'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn, Leaf, Sparkles, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-100/30 blur-[130px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/20 blur-[130px] rounded-full" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Back navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors font-bold text-xs uppercase tracking-widest mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Ana Səhifəyə qayıt
        </Link>

        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-3xl bg-emerald-600 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30 mx-auto mb-8">
            <Leaf size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-[-0.02em]">
            {t('auth.login_title')}
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-xs mx-auto">
            {t('auth.login_subtitle')}
          </p>
        </div>

        <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="input-field h-16 !shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">
                {t('auth.password')}
              </label>
              <div className="relative group">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field h-16 !shadow-sm pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500 transition-colors p-2"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-16 !rounded-3xl shadow-xl shadow-emerald-500/20"
            >
              <span className="flex items-center gap-3">
                {loading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    <LogIn size={20} />
                    <span className="uppercase tracking-widest text-[11px] font-black">{t('auth.submit_login')}</span>
                  </>
                )}
              </span>
            </button>
          </form>

          <footer className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {t('auth.no_account')}{' '}
              <Link href="/auth/register" className="text-emerald-600 hover:text-emerald-500 transition-colors underline decoration-2 underline-offset-8">
                {t('nav.register')}
              </Link>
            </p>
          </footer>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex items-center justify-center gap-8 opacity-40">
           <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
            <ShieldCheck size={14} className="text-emerald-500" /> Secure Protocol
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
            <Sparkles size={14} className="text-emerald-500" /> SSL Verified
          </div>
        </div>
      </div>
    </div>
  );
}
