'use client';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-white pt-24 pb-16 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
              Azərbaycanın milli könüllülük və texniki inkişaf platforması. Join our community today.
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
  );
}
