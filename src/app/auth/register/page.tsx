'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  User, BookOpen, Atom, ChevronRight, ChevronLeft, CheckCircle,
  Leaf, ShieldCheck, Heart, Zap, Monitor, FlaskConical, Loader2, ArrowLeft,
} from 'lucide-react';
import { authApi } from '../../../lib/api';
import { useI18n } from '../../../hooks/useI18n';

const SKILLS_OPTIONS = [
  'Data Analysis', 'Research', 'Teaching', 'Communication', 'Field Work',
  'Report Writing', 'First Aid', 'IT/Software', 'Engineering', 'Chemistry',
  'Biology', 'Physics', 'Mathematics', 'Environmental Science', 'Project Management',
];

const VOLUNTEER_PREFS = [
  'Environment', 'Education', 'Health', 'Social Support', 'STEM',
  'Youth Programs', 'Community Development', 'Research', 'Industrial Safety',
];

const EDUCATION_LEVELS = ['High School', "Bachelor's", "Master's", 'PhD', 'Other'];

const FIELDS_OF_STUDY = [
  'Chemical Engineering',
  'Software Engineering / CS',
  'Process Engineering',
  'Petroleum Engineering',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Environmental Science',
  'Biology / Biochemistry',
  'Chemistry',
  'Physics',
  'Mathematics',
  'Business Administration',
  'Economics',
  'Other',
];

const SPECIALIZATION_OPTIONS = [
  'Process Engineering', 'Petrochemistry', 'Environmental Engineering',
  'Material Science', 'Polymer Engineering', 'Food Engineering', 'Safety Engineering',
];

const SOFTWARE_OPTIONS = ['AutoCAD', 'MATLAB', 'Aspen Plus', 'HYSYS', 'COMSOL', 'Python', 'MS Excel (Advanced)'];
const LAB_OPTIONS = ['Titration', 'Chromatography', 'Spectroscopy', 'Distillation', 'Ph Measurement', 'Microscopy'];
const INDUSTRIAL_OPTIONS = ['HAZOP', 'Process Control', 'QMS (ISO)', 'Industrial Safety', 'Plant Design', 'Reactor Operation'];

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '+994',
    password: '',
    dateOfBirth: '',
    gender: '',
    city: '',
    address: '',
    educationLevel: '',
    university: '',
    fieldOfStudy: '',
    skills: [] as string[],
    volunteerPreferences: [] as string[],
    motivationLetter: '',
    specialization: '',
    softwareSkills: [] as string[],
    laboratorySkills: [] as string[],
    industrialSkills: [] as string[],
  });

  const isChemical = form.fieldOfStudy.toLowerCase().includes('chemical');
  const [showOtherField, setShowOtherField] = useState(false);

  const set = (key: string, value: unknown) => {
    if (key === 'fieldOfStudy') {
      if (value === 'Other') {
        setShowOtherField(true);
        setForm(prev => ({ ...prev, [key]: '' }));
      } else {
        setShowOtherField(false);
        setForm(prev => ({ ...prev, [key]: value as string }));
      }
      return;
    }
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const toggleArray = (key: string, val: string) => {
    setForm(prev => {
      const arr = prev[key as keyof typeof prev] as string[];
      return {
        ...prev,
        [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val],
      };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await authApi.register(form);
      const { token, user } = res.data;
      localStorage.setItem('azv_token', token);
      localStorage.setItem('azv_user', JSON.stringify(user));
      toast.success('Qeydiyyat tamamlandı! Xoş gəldiniz.');
      router.push('/dashboard');
    } catch (err: any) {
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        toast.error(err.response.data.errors.map((e: any) => e.msg).join(', '));
      } else {
        toast.error(err.response?.data?.message || 'Qeydiyyat uğursuz oldu. Yenidən cəhd edin.');
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: t('auth.step_account'), icon: <User size={14} /> },
    { num: 2, label: t('auth.step_profile'), icon: <BookOpen size={14} /> },
    { num: 3, label: t('auth.step_technical'), icon: <Atom size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Decorative blobs — hidden on very small screens to avoid overflow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-100/20 blur-[130px] rounded-full pointer-events-none -z-0 hidden sm:block" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/15 blur-[130px] rounded-full pointer-events-none -z-0 hidden sm:block" />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 animate-fade-in">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors font-semibold text-xs uppercase tracking-widest mb-8 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          Ana Səhifəyə qayıt
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/25 mx-auto mb-6">
            <Leaf size={26} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            {t('auth.register_title')}
          </h1>
          <p className="text-slate-500 font-medium text-base leading-relaxed">
            AzVolunteer platformasına qoşulmaq üçün formu doldurun
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-10">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => { if (step > s.num) setStep(s.num); }}
                className={`flex items-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border transition-all duration-300 ${
                  step === s.num
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                    : step > s.num
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-pointer hover:bg-emerald-100'
                    : 'bg-white text-slate-400 border-slate-200 cursor-default'
                }`}
              >
                {step > s.num ? <ShieldCheck size={14} /> : s.icon}
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden font-black">{s.num}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`w-6 sm:w-10 h-0.5 rounded-full ${step > s.num ? 'bg-emerald-400' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          <div className="p-6 sm:p-10">

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 flex-shrink-0">
                    <User size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">{t('auth.account_data_title')}</h2>
                    <p className="text-slate-400 text-sm font-medium mt-0.5">Şəxsi məlumatlarınızı daxil edin</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('auth.first_name')} *</label>
                    <input className="input-field" value={form.firstName} onChange={e => set('firstName', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('auth.last_name')} *</label>
                    <input className="input-field" value={form.lastName} onChange={e => set('lastName', e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('auth.email')} *</label>
                    <input type="email" className="input-field" value={form.email} onChange={e => set('email', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('auth.phone')} *</label>
                    <input className="input-field" value={form.phone} onChange={e => set('phone', e.target.value)} required />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('auth.password')} *</label>
                  <input type="password" className="input-field" value={form.password} onChange={e => set('password', e.target.value)} required />
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">Minimum 8 simvol, rəqəm və böyük hərflər daxil edin</p>
                </div>

                <button
                  className="btn-primary w-full !py-4 !rounded-2xl mt-2"
                  onClick={() => {
                    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password) {
                      toast.error(t('auth.validation.fill_all'));
                      return;
                    }
                    setStep(2);
                  }}
                >
                  <span className="font-bold">{t('common.next')}</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 flex-shrink-0">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">{t('auth.volunteer_profile_title')}</h2>
                    <p className="text-slate-400 text-sm font-medium mt-0.5">İxtisas və təcrübə məlumatları</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('auth.dob')} *</label>
                    <input type="date" className="input-field" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('auth.gender')} *</label>
                    <select className="input-field appearance-none cursor-pointer" value={form.gender} onChange={e => set('gender', e.target.value)} required>
                      <option value="">{t('auth.select_default')}</option>
                      <option value="male">Kişi / Male</option>
                      <option value="female">Qadın / Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('auth.city')} *</label>
                    <input className="input-field" value={form.city} onChange={e => set('city', e.target.value)} placeholder="Bakı" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('auth.education')} *</label>
                    <select className="input-field appearance-none cursor-pointer" value={form.educationLevel} onChange={e => set('educationLevel', e.target.value)} required>
                      <option value="">Səviyyəni Seçin</option>
                      {EDUCATION_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('auth.university')} *</label>
                    <input className="input-field" value={form.university} onChange={e => set('university', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('auth.field_of_study')} *</label>
                    <select
                      className="input-field appearance-none cursor-pointer"
                      value={FIELDS_OF_STUDY.includes(form.fieldOfStudy) ? form.fieldOfStudy : (showOtherField ? 'Other' : '')}
                      onChange={e => set('fieldOfStudy', e.target.value)}
                      required
                    >
                      <option value="">İxtisas Seçin</option>
                      {FIELDS_OF_STUDY.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    {isChemical && (
                      <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        <Zap size={10} className="fill-emerald-600/20" />
                        Advanced Engineering Profile
                      </div>
                    )}
                  </div>
                </div>

                {showOtherField && (
                  <div className="animate-slide-up">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Digər ixtisas adını daxil edin</label>
                    <input className="input-field" placeholder="İxtisas adını yazın..." value={form.fieldOfStudy} onChange={e => set('fieldOfStudy', e.target.value)} />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{t('auth.skills')} *</label>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_OPTIONS.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleArray('skills', skill)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                          form.skills.includes(skill)
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Könüllülük Maraq Sahələri *</label>
                  <div className="flex flex-wrap gap-2">
                    {VOLUNTEER_PREFS.map(pref => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => toggleArray('volunteerPreferences', pref)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                          form.volunteerPreferences.includes(pref)
                            ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/10'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('auth.motivation')} *</label>
                  <textarea
                    rows={4}
                    className="input-field resize-none !rounded-2xl leading-relaxed"
                    value={form.motivationLetter}
                    onChange={e => set('motivationLetter', e.target.value)}
                    placeholder="Könüllü olmaq motivasiyanız haqqında qısa məlumat verin..."
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    className="flex-1 py-4 rounded-2xl font-bold text-sm bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-2 transition-all"
                    onClick={() => setStep(1)}
                  >
                    <ChevronLeft size={16} /> Geri
                  </button>
                  <button
                    className="btn-primary flex-[2] !py-4 !rounded-2xl"
                    onClick={() => {
                      if (!form.dateOfBirth || !form.gender || !form.city || !form.educationLevel || !form.university || !form.fieldOfStudy || !form.motivationLetter) {
                        toast.error(t('auth.validation.fill_all'));
                        return;
                      }
                      setStep(3);
                    }}
                  >
                    <span>Növbəti</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                {isChemical ? (
                  <>
                    <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                        <Atom size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900">{t('auth.chemical_section')}</h2>
                        <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mt-0.5">Mühəndislik Portfeli</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Core Specialization</label>
                      <select
                        className="input-field appearance-none cursor-pointer"
                        value={form.specialization}
                        onChange={e => set('specialization', e.target.value)}
                      >
                        <option value="">Select Path</option>
                        {SPECIALIZATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        <option value="Other">Custom Spec</option>
                      </select>
                    </div>

                    {[
                      { key: 'softwareSkills', label: 'Tech / Software', options: SOFTWARE_OPTIONS, icon: <Monitor size={14} /> },
                      { key: 'laboratorySkills', label: 'Lab Operations', options: LAB_OPTIONS, icon: <FlaskConical size={14} /> },
                      { key: 'industrialSkills', label: 'Industrial Protocols', options: INDUSTRIAL_OPTIONS, icon: <ShieldCheck size={14} /> },
                    ].map(({ key, label, options, icon }) => (
                      <div key={key} className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-100">
                        <label className="block text-[11px] font-black uppercase tracking-widest text-slate-700 mb-4 flex items-center gap-2">
                          <span className="text-emerald-500">{icon}</span> {label}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {options.map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => toggleArray(key, opt)}
                              className={`px-3 py-2 rounded-lg text-[11px] font-bold border transition-all duration-200 ${
                                (form[key as keyof typeof form] as string[]).includes(opt)
                                  ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mx-auto mb-8 shadow-lg shadow-emerald-100/30">
                      <Heart size={36} className="fill-emerald-500/10" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Profil Hazırdır</h2>
                    <p className="text-slate-500 text-base font-medium max-w-sm mx-auto">
                      Məlumatlarınız tamdır. Qeydiyyatı tamamlamaq üçün aşağıdakı düyməyə klikləyin.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-slate-50">
                  <button
                    className="flex-1 py-4 rounded-2xl font-bold text-sm bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-2 transition-all"
                    onClick={() => setStep(2)}
                  >
                    <ChevronLeft size={16} /> Geri
                  </button>
                  <button
                    className="btn-primary flex-[2] !py-4 !rounded-2xl"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        <span>Qeydiyyatı Tamamla</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer link */}
        <p className="text-center mt-8 text-sm text-slate-500 font-medium">
          Artıq hesabınız var?{' '}
          <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">
            Daxil Olun
          </Link>
        </p>
      </div>
    </div>
  );
}
