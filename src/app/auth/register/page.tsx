'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { User, BookOpen, Atom, ChevronRight, ChevronLeft, CheckCircle, Leaf, Sparkles, ShieldCheck, Heart, Zap, Monitor, FlaskConical, Loader2, ArrowLeft } from 'lucide-react';
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

const EDUCATION_LEVELS = [
  'High School', 'Bachelor\'s', 'Master\'s', 'PhD', 'Other'
];

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
  'Other'
];

const SPECIALIZATION_OPTIONS = [
  'Process Engineering',
  'Petrochemistry',
  'Environmental Engineering',
  'Material Science',
  'Polymer Engineering',
  'Food Engineering',
  'Safety Engineering'
];

const SOFTWARE_OPTIONS = [
  'AutoCAD',
  'MATLAB',
  'Aspen Plus',
  'HYSYS',
  'COMSOL',
  'Python',
  'MS Excel (Advanced)'
];

const LAB_OPTIONS = [
  'Titration',
  'Chromatography',
  'Spectroscopy',
  'Distillation',
  'Ph Measurement',
  'Microscopy'
];

const INDUSTRIAL_OPTIONS = [
  'HAZOP',
  'Process Control',
  'QMS (ISO)',
  'Industrial Safety',
  'Plant Design',
  'Reactor Operation'
];

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    // Step 1 - Account
    firstName: '',
    lastName: '',
    email: '',
    phone: '+994',
    password: '',
    // Step 2 - Profile
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
    // Step 3 - Chemical (conditional)
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
        setForm((prev) => ({ ...prev, [key]: '' }));
      } else {
        setShowOtherField(false);
        setForm((prev) => ({ ...prev, [key]: value as string }));
      }
      return;
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArray = (key: string, val: string) => {
    setForm((prev) => {
      const arr = prev[key as keyof typeof prev] as string[];
      return {
        ...prev,
        [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val],
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
      toast.success('Registration completed successfully! Welcome to the ecosystem.');
      router.push('/dashboard');
    } catch (err: any) {
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const errorMessages = err.response.data.errors.map((e: any) => e.msg).join(', ');
        toast.error(errorMessages);
      } else {
        const msg = err.response?.data?.message || 'Registration failed. Try again.';
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: t('auth.step_account'), icon: <User size={16} /> },
    { num: 2, label: t('auth.step_profile'), icon: <BookOpen size={16} /> },
    { num: 3, label: t('auth.step_technical'), icon: <Atom size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-emerald-100/30 blur-[130px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/20 blur-[130px] rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10 animate-fade-in">
        {/* Back navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors font-bold text-xs uppercase tracking-widest mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Ana Səhifəyə qayıt
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-3xl bg-emerald-600 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30 mx-auto mb-8">
            <Leaf size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-[-0.02em]">{t('auth.register_title')}</h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm mx-auto">AzVolunteer platformasına qoşulmaq üçün formu doldurun</p>
        </div>

        {/* Steps Progress */}
        <div className="flex items-center justify-center gap-4 mb-14 overflow-x-auto pb-6 scrollbar-hide">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-4 shrink-0">
              <div
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-500 ${step === s.num
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-xl shadow-emerald-500/20'
                  : step > s.num
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-white text-slate-400 border-slate-100'
                  }`}
              >
                {step > s.num ? <ShieldCheck size={18} /> : s.icon}
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{s.num}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-10 h-0.5 rounded-full ${step > s.num ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white p-8 md:p-14 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
          
          {/* STEP 1 - Account */}
          {step === 1 && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex items-center gap-5 pb-8 border-b border-slate-50">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">{t('auth.account_data_title')}</h2>
                  <p className="text-slate-400 text-sm font-medium mt-1">Şəxsi məlumatlarınızı daxil edin</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">{t('auth.first_name')} *</label>
                  <input className="input-field h-16 !shadow-sm" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">{t('auth.last_name')} *</label>
                  <input className="input-field h-16 !shadow-sm" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">{t('auth.email')} *</label>
                  <input type="email" className="input-field h-16 !shadow-sm" value={form.email} onChange={(e) => set('email', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">{t('auth.phone')} *</label>
                  <input className="input-field h-16 !shadow-sm" value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">{t('auth.password')} *</label>
                <input type="password" className="input-field h-16 !shadow-sm" value={form.password} onChange={(e) => set('password', e.target.value)} required />
                <p className="text-[10px] text-slate-400 mt-3 font-medium ml-1">Minimum 8 simvol, rəqəm və böyük hərflər daxil edin</p>
              </div>

              <div className="pt-6">
                <button
                  className="btn-primary w-full h-16 !rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/10"
                  onClick={() => {
                    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password) {
                      toast.error(t('auth.validation.fill_all'));
                      return;
                    }
                    setStep(2);
                  }}
                >
                  <span className="uppercase tracking-widest text-[11px] font-black">{t('common.next')}</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 - Profile */}
          {step === 2 && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex items-center gap-5 pb-8 border-b border-slate-50">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">{t('auth.volunteer_profile_title')}</h2>
                  <p className="text-slate-400 text-sm font-medium mt-1">İxtisas və təcrübə məlumatları</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">{t('auth.dob')} *</label>
                  <input type="date" className="input-field h-16 !shadow-sm" value={form.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">{t('auth.gender')} *</label>
                  <select className="input-field h-16 !shadow-sm appearance-none cursor-pointer font-bold text-slate-700" value={form.gender} onChange={(e) => set('gender', e.target.value)} required>
                    <option value="">{t('auth.select_default')}</option>
                    <option value="male">Kişi / Male</option>
                    <option value="female">Qadın / Female</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">{t('auth.city')} *</label>
                  <input className="input-field h-16 !shadow-sm" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Bakı" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">{t('auth.education')} *</label>
                  <select className="input-field h-16 !shadow-sm appearance-none cursor-pointer font-bold text-slate-700" value={form.educationLevel} onChange={(e) => set('educationLevel', e.target.value)} required>
                    <option value="">Səviyyəni Seçin</option>
                    {EDUCATION_LEVELS.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">{t('auth.university')} *</label>
                  <input className="input-field h-16 !shadow-sm" value={form.university} onChange={(e) => set('university', e.target.value)} required />
                </div>
                <div className="relative">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">{t('auth.field_of_study')} *</label>
                  <select
                    className="input-field h-16 !shadow-sm appearance-none cursor-pointer font-bold text-slate-700"
                    value={FIELDS_OF_STUDY.includes(form.fieldOfStudy) ? form.fieldOfStudy : (showOtherField ? 'Other' : '')}
                    onChange={(e) => set('fieldOfStudy', e.target.value)}
                    required
                  >
                    <option value="">İxtisas Seçin</option>
                    {FIELDS_OF_STUDY.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  {isChemical && (
                    <div className="mt-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 w-fit">
                      <Zap size={10} className="fill-emerald-600/20" /> Advanced Engineering Profile
                    </div>
                  )}
                </div>
              </div>

              {showOtherField && (
                <div className="animate-slide-up">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1 whitespace-nowrap">Digər ixtisas adını daxil edin</label>
                  <input className="input-field h-16" placeholder="İxtisas adını yazın..." value={form.fieldOfStudy} onChange={(e) => set('fieldOfStudy', e.target.value)} />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5 ml-1">{t('auth.skills')} *</label>
                <div className="flex flex-wrap gap-3">
                  {SKILLS_OPTIONS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleArray('skills', skill)}
                      className={`px-5 py-3 rounded-[1.25rem] text-[11px] font-bold tracking-tight border transition-all duration-300 ${form.skills.includes(skill)
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200'
                        }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5 ml-1">Könüllülük Maraq Sahələri *</label>
                <div className="flex flex-wrap gap-3">
                  {VOLUNTEER_PREFS.map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => toggleArray('volunteerPreferences', pref)}
                      className={`px-5 py-3 rounded-[1.25rem] text-[11px] font-bold tracking-tight border transition-all duration-300 ${form.volunteerPreferences.includes(pref)
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200'
                        }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">{t('auth.motivation')} *</label>
                <textarea
                  rows={5}
                  className="input-field !rounded-[2rem] p-8 resize-none font-medium text-slate-700 leading-relaxed bg-slate-50 border-none shadow-inner"
                  value={form.motivationLetter}
                  onChange={(e) => set('motivationLetter', e.target.value)}
                  placeholder="Könüllü olmaq motivasiyanız haqqında qısa məlumat verin..."
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button className="flex-1 h-16 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] bg-slate-50 text-slate-400 hover:text-slate-600 transition-all border border-slate-100 flex items-center justify-center gap-2" onClick={() => setStep(1)}>
                  <ChevronLeft size={16} /> Geri
                </button>
                <button
                  className="btn-primary flex-[2] h-16 !rounded-[1.5rem]"
                  onClick={() => {
                    if (!form.dateOfBirth || !form.gender || !form.city || !form.educationLevel || !form.university || !form.fieldOfStudy || !form.motivationLetter) {
                      toast.error(t('auth.validation.fill_all'));
                      return;
                    }
                    setStep(3);
                  }}
                >
                  <span className="uppercase tracking-widest text-[11px] font-black">Növbəti</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 - Technical (Conditional) */}
          {step === 3 && (
            <div className="space-y-10 animate-fade-in relative z-10">
              {isChemical ? (
                <>
                  <div className="flex items-center gap-5 pb-8 border-b border-slate-50">
                    <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-xl">
                      <Atom size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">{t('auth.chemical_section')}</h2>
                      <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mt-1">Mühəndislik Portfeli</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Core Specialization</label>
                    <select
                      className="input-field h-16 !shadow-sm appearance-none cursor-pointer font-bold text-slate-700"
                      value={form.specialization}
                      onChange={(e) => set('specialization', e.target.value)}
                    >
                      <option value="">Select Path</option>
                      {SPECIALIZATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      <option value="Other">Custom Spec</option>
                    </select>
                  </div>

                  {[
                    { key: 'softwareSkills', label: 'Tech / Software OS', options: SOFTWARE_OPTIONS, icon: <Monitor size={16} /> },
                    { key: 'laboratorySkills', label: 'Lab Operations', options: LAB_OPTIONS, icon: <FlaskConical size={16} /> },
                    { key: 'industrialSkills', label: 'Industrial Protocols', options: INDUSTRIAL_OPTIONS, icon: <ShieldCheck size={16} /> },
                  ].map(({ key, label, options, icon }) => (
                    <div key={key} className="p-8 rounded-[2.5rem] bg-slate-50/50 border border-slate-100">
                      <label className="block text-[11px] font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-3">
                        <div className="text-emerald-500">{icon}</div> {label}
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {options.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => toggleArray(key, opt)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 ${(form[key as keyof typeof form] as string[]).includes(opt)
                              ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 shadow-sm'
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
                <div className="text-center py-20">
                  <div className="w-28 h-28 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mx-auto mb-10 shadow-xl shadow-emerald-100/30">
                    <Heart size={48} className="fill-emerald-500/10" />
                  </div>
                  <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Profil Hazırdır</h2>
                  <p className="text-slate-500 text-lg font-medium max-w-sm mx-auto">Məlumatlarınız tamdır. Qeydiyyatı tamamlamaq üçün aşağıdakı düyməyə klikləyin.</p>
                </div>
              )}

              <div className="flex gap-4 pt-10 border-t border-slate-50">
                <button className="flex-1 h-16 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] bg-slate-50 text-slate-400 hover:text-slate-600 border border-slate-100" onClick={() => setStep(2)}>
                  <ChevronLeft size={16} /> Geri
                </button>
                <button className="btn-primary flex-[2] h-16 !rounded-[1.5rem] shadow-xl shadow-emerald-500/10 active:scale-98 transition-all" onClick={handleSubmit} disabled={loading}>
                  <span className="flex items-center justify-center gap-3">
                    {loading ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck size={20} />
                        <span className="uppercase tracking-widest text-[11px] font-black">Qeydiyyatı Tamamla</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-14 pt-10 border-t border-slate-100 text-center">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Artıq hesabınız var?{' '}
              <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-500 transition-colors underline decoration-2 underline-offset-8">
                Daxil Olun
              </Link>
            </p>
          </footer>
      </div>
    </div>
  );
}
