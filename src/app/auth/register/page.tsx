'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { User, BookOpen, Atom, ChevronRight, ChevronLeft, CheckCircle, Leaf, Sparkles, ShieldCheck, Heart, Zap, Monitor, FlaskConical } from 'lucide-react';
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
      toast.success('Registration completed successfully! Welcome to the forest.');
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
    <div className="min-h-screen bg-[#0a1a0f] py-20 px-4 relative overflow-hidden">
      {/* Deep Forest Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-green-900/10 blur-[130px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-900/10 blur-[130px] rounded-full animate-pulse delay-700 pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-600 to-lime-500 flex items-center justify-center text-white shadow-2xl shadow-green-500/20 group-hover:rotate-12 transition-transform duration-500">
              <Leaf size={24} className="fill-white/10" />
            </div>
            <span className="font-display font-black text-2xl text-white tracking-tighter">
              Az<span className="text-green-500">Volunteer</span>
            </span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{t('auth.register_title')}</h1>
          <p className="text-slate-500 font-medium italic text-sm">Join our growing ecosystem</p>
        </div>

        {/* Steps Progress */}
        <div className="flex items-center justify-center gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-4 shrink-0">
              <div
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all duration-500 ${step === s.num
                  ? 'bg-green-500 text-black border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.3)]'
                  : step > s.num
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : 'bg-emerald-950/40 text-slate-600 border-white/5 opacity-50'
                  }`}
              >
                {step > s.num ? <ShieldCheck size={18} /> : s.icon}
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{s.num}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-[1px] ${step > s.num ? 'bg-green-500/50' : 'bg-white/5'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="card p-8 md:p-12 bg-emerald-950/20 backdrop-blur-3xl border-white/5 rounded-[40px] shadow-4xl relative overflow-hidden group">
          {/* Subtle Shimmer Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          {/* STEP 1 - Account */}
          {step === 1 && (
            <div className="space-y-8 animate-fade-in relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20">
                  <User size={20} />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-wider">{t('auth.account_data_title')}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-2 ml-4">{t('auth.first_name')} *</label>
                  <input className="input-field h-14 !rounded-2xl !bg-black/20 !border-white/5 px-6" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-2 ml-4">{t('auth.last_name')} *</label>
                  <input className="input-field h-14 !rounded-2xl !bg-black/20 !border-white/5 px-6" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-2 ml-4">{t('auth.email')} *</label>
                <input type="email" className="input-field h-14 !rounded-2xl !bg-black/20 !border-white/5 px-6" value={form.email} onChange={(e) => set('email', e.target.value)} required />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-2 ml-4">{t('auth.phone')} *</label>
                <input className="input-field h-14 !rounded-2xl !bg-black/20 !border-white/5 px-6" value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-2 ml-4">{t('auth.password')} *</label>
                <input type="password" className="input-field h-14 !rounded-2xl !bg-black/20 !border-white/5 px-6" value={form.password} onChange={(e) => set('password', e.target.value)} required />
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mt-2 ml-4">Min. 8 characters with Uppercase & Numbers</p>
              </div>

              <button
                className="btn-primary w-full h-16 !rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-xs shadow-3xl shadow-green-500/10 group overflow-hidden"
                onClick={() => {
                  if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password) {
                    toast.error(t('auth.validation.fill_all'));
                    return;
                  }
                  // basic validation...
                  setStep(2);
                }}
              >
                {t('common.next')} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* STEP 2 - Profile */}
          {step === 2 && (
            <div className="space-y-8 animate-fade-in relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20">
                  <BookOpen size={20} />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-wider">{t('auth.volunteer_profile_title')}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-2 ml-4">{t('auth.dob')} *</label>
                  <input type="date" className="input-field h-14 !rounded-2xl !bg-black/20 !border-white/5 px-6 invert-[0.9] hue-rotate-180" value={form.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-2 ml-4">{t('auth.gender')} *</label>
                  <select className="input-field h-14 !rounded-2xl !bg-black/20 !border-white/5 px-6 appearance-none font-bold" value={form.gender} onChange={(e) => set('gender', e.target.value)} required>
                    <option value="">{t('auth.select_default')}</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-2 ml-4">{t('auth.city')} *</label>
                  <input className="input-field h-14 !rounded-2xl !bg-black/20 !border-white/5 px-6" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Baku" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-2 ml-4">{t('auth.education')} *</label>
                  <select className="input-field h-14 !rounded-2xl !bg-black/20 !border-white/5 px-6 appearance-none font-bold" value={form.educationLevel} onChange={(e) => set('educationLevel', e.target.value)} required>
                    <option value="">Select Level</option>
                    {EDUCATION_LEVELS.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-2 ml-4">{t('auth.university')} *</label>
                <input className="input-field h-14 !rounded-2xl !bg-black/20 !border-white/5 px-6" value={form.university} onChange={(e) => set('university', e.target.value)} required />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-2 ml-4">{t('auth.field_of_study')} *</label>
                <select
                  className="input-field h-14 !rounded-2xl !bg-black/20 !border-white/5 px-6 appearance-none font-bold"
                  value={FIELDS_OF_STUDY.includes(form.fieldOfStudy) ? form.fieldOfStudy : (showOtherField ? 'Other' : '')}
                  onChange={(e) => set('fieldOfStudy', e.target.value)}
                  required
                >
                  <option value="">Select Field</option>
                  {FIELDS_OF_STUDY.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                {showOtherField && (
                  <input className="input-field h-14 !rounded-2xl !bg-black/20 !border-white/5 px-6 mt-4" placeholder="Enter study field" value={form.fieldOfStudy} onChange={(e) => set('fieldOfStudy', e.target.value)} />
                )}
                {isChemical && (
                  <p className="text-[9px] font-black uppercase tracking-widest text-green-400 mt-3 ml-4 flex items-center gap-2">
                    <Zap size={10} className="fill-green-400/20" /> Advanced Engineering Profile Unlocked
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-4 ml-4">{t('auth.skills')} *</label>
                <div className="flex flex-wrap gap-2">
                  {SKILLS_OPTIONS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleArray('skills', skill)}
                      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${form.skills.includes(skill)
                        ? 'bg-green-500 border-green-400 text-black shadow-lg shadow-green-500/10'
                        : 'bg-black/20 border-white/5 text-slate-500 hover:border-white/10'
                        }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-6 ml-4">Orientation / Interest *</label>
                <div className="flex flex-wrap gap-2">
                  {VOLUNTEER_PREFS.map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => toggleArray('volunteerPreferences', pref)}
                      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${form.volunteerPreferences.includes(pref)
                        ? 'bg-lime-500 border-lime-400 text-black shadow-lg shadow-lime-500/10'
                        : 'bg-black/20 border-white/5 text-slate-500 hover:border-white/10'
                        }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-2 ml-4">{t('auth.motivation')} *</label>
                <textarea
                  rows={4}
                  className="input-field !rounded-[24px] !bg-black/20 !border-white/5 p-6 resize-none italic font-medium"
                  value={form.motivationLetter}
                  onChange={(e) => set('motivationLetter', e.target.value)}
                  placeholder="Share your vision for volunteering..."
                  required
                />
              </div>

              <div className="flex gap-4">
                <button className="btn-secondary flex-1 h-16 !rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] bg-white/5 border-white/5 text-slate-500 hover:text-white" onClick={() => setStep(1)}>
                  <ChevronLeft size={16} /> Previous
                </button>
                <button
                  className="btn-primary flex-[2] h-16 !rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]"
                  onClick={() => {
                    if (!form.dateOfBirth || !form.gender || !form.city || !form.educationLevel || !form.university || !form.fieldOfStudy || !form.motivationLetter) {
                      toast.error(t('auth.validation.fill_all'));
                      return;
                    }

                    // Age validation (14+)
                    const birthDate = new Date(form.dateOfBirth);
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                      age--;
                    }

                    if (age < 14) {
                      toast.error('You must be at least 14 years old to join AzVolunteer.');
                      return;
                    }

                    setStep(3);
                  }}
                >
                  Confirm Profile <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 - Technical (Conditional) */}
          {step === 3 && (
            <div className="space-y-8 animate-fade-in relative z-10">
              {isChemical ? (
                <>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white shadow-2xl border border-white/10">
                      <Atom size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white uppercase tracking-wider">{t('auth.chemical_section')}</h2>
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-500/60 mt-1">Specialized Engineering Dossier</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-2 ml-4">Core Specialization</label>
                    <select
                      className="input-field h-14 !rounded-2xl !bg-black/20 !border-white/5 px-6 appearance-none font-bold"
                      value={form.specialization}
                      onChange={(e) => set('specialization', e.target.value)}
                    >
                      <option value="">Select Path</option>
                      {SPECIALIZATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      <option value="Other">Custom Spec</option>
                    </select>
                    {form.specialization === 'Other' && (
                      <input className="input-field h-14 !rounded-2xl !bg-black/20 !border-white/5 px-6 mt-4" placeholder="Enter specialty" onChange={(e) => set('specialization', e.target.value)} />
                    )}
                  </div>

                  {[
                    { key: 'softwareSkills', label: 'Tech / Software OS', options: SOFTWARE_OPTIONS, icon: <Monitor size={14} /> },
                    { key: 'laboratorySkills', label: 'Lab Operations', options: LAB_OPTIONS, icon: <FlaskConical size={14} /> },
                    { key: 'industrialSkills', label: 'Industrial Protocols', options: INDUSTRIAL_OPTIONS, icon: <ShieldCheck size={14} /> },
                  ].map(({ key, label, options, icon }) => (
                    <div key={key}>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-4 ml-4 flex items-center gap-2">
                        {icon} {label}
                      </label>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {options.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => toggleArray(key, opt)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${(form[key as keyof typeof form] as string[]).includes(opt)
                              ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                              : 'bg-black/20 border-white/5 text-slate-500 hover:border-white/10'
                              }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      <input
                        className="input-field h-12 !rounded-xl !bg-black/40 !border-white/5 px-5 text-[10px] font-medium"
                        placeholder="+ Add custom capability (Press Enter)"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val) {
                              toggleArray(key, val);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2 mt-3">
                        {(form[key as keyof typeof form] as string[]).filter(v => !options.includes(v)).map(v => (
                          <span key={v} onClick={() => toggleArray(key, v)} className="px-3 py-1 bg-green-500/5 text-green-400 border border-green-500/10 rounded-lg text-[10px] font-black cursor-pointer hover:bg-rose-500/10 hover:text-rose-400 group/custom">
                            {v} <span className="opacity-40 group-hover/custom:opacity-100">×</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-20 animate-slide-up">
                  <div className="w-24 h-24 rounded-[32px] bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center text-green-500 mx-auto mb-10 shadow-3xl shadow-green-500/10 animate-float">
                    <Heart size={48} className="fill-green-500/20" />
                  </div>
                  <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Ready for deployment</h2>
                  <p className="text-slate-500 font-medium italic mb-10 max-w-sm mx-auto">Your volunteer profile is complete. Submit to join our active missions across Azerbaijan.</p>

                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left">
                      <span className="text-[10px] font-black uppercase text-green-500 block mb-1">Status</span>
                      <span className="text-white font-bold">READY</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left">
                      <span className="text-[10px] font-black uppercase text-green-500 block mb-1">Dossier</span>
                      <span className="text-white font-bold">SIGNED</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-10">
                <button className="btn-secondary flex-1 h-16 !rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] bg-white/5 border-white/5 text-slate-500" onClick={() => setStep(2)}>
                  <ChevronLeft size={16} /> Back
                </button>
                <button className="btn-primary flex-[2] h-16 !rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-3xl shadow-green-500/20 group relative overflow-hidden" onClick={handleSubmit} disabled={loading}>
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck size={20} /> Complete Registration
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mt-10">
          Already a member?{' '}
          <Link href="/auth/login" className="text-green-500 hover:text-lime-400 transition-colors underline-offset-4 hover:underline">
            Log In
          </Link>
        </p>

        {/* Branding Footer */}
        <div className="mt-16 flex flex-col items-center gap-6 opacity-30 group">
          <div className="flex items-center gap-3 text-slate-500 font-mono text-[9px] uppercase tracking-[0.4em]">
            AzVolunteer <span className="w-1.5 h-[1px] bg-slate-700" /> V1.0 Bio-Ecosystem
          </div>
          <div className="flex gap-8 text-slate-600">
            <Zap size={16} />
            <ShieldCheck size={16} />
            <Heart size={16} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .shadow-4xl {
          box-shadow: 0 48px 120px -32px rgba(0, 0, 0, 0.7);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
