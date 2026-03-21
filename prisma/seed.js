const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminHash = await bcrypt.hash('Leomaqa02.', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'maqa10573@gmail.com' },
    update: {
      passwordHash: adminHash,
      role: 'admin',
      status: 'approved',
      deletedAt: null,
    },
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'maqa10573@gmail.com',
      phone: '+994501234567',
      passwordHash: adminHash,
      role: 'admin',
      status: 'approved',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // New Realistic Projects
  const projects = [
    {
      title: "Green Baku — Tree Planting Campaign",
      titleAz: "Yaşıl Bakı — Ağacəkmə Kampaniyası",
      description: "Tree planting campaign in Baku's industrial districts, especially in Binagadi and Surakhani areas. Each volunteer will plant and care for at least 5 trees.",
      descriptionAz: "Bakının sənaye rayonlarında, xüsusilə Binəqədi və Suraxanı ərazilərində ağacəkmə aksiyası. Hər könüllü minimum 5 ağac əkib qulluq edəcək.",
      location: "Baku, Binagadi District",
      locationAz: "Bakı, Binəqədi rayonu",
      category: "Environmental",
      complexityLevel: "low",
      benefits: "Ecology certificate, volunteer booklet, free botany workshop",
      benefitsAz: "Ekoloji sertifikat, könüllülük kitabçası, ücretsiz baytarlıq kursu",
      requirements: "16+ years old, physically active, willing to work outdoors",
      requirementsAz: "16+ yaş, fiziki aktivlik, açıq havada işləmə istəyi",
      requiredSkills: ["Physical strength", "Teamwork", "Passion for ecology"],
      isActive: true,
      deadline: "15.04.2026",
      spotsLeft: "Only 5 spots left!",
      spotsLeftAz: "Cəmi 5 yer qalıb!"
    },
    {
      title: "Old City Tourism Guide Volunteer",
      titleAz: "Köhnə Şəhər Turizm Bələdçisi",
      description: "Organizing free walking tours for local and foreign tourists in Icherisheher. Volunteers will explain the city's history, architecture and culture.",
      descriptionAz: "İçərişəhərdə yerli və xarici turistlərə pulsuz gəzinti təşkil edilməsi. Könüllülər şəhərin tarixini, memarlığını və mədəniyyətini izah edəcəklər.",
      location: "Baku, Icherisheher (Old City)",
      locationAz: "Bakı, İçərişəhər",
      category: "Social",
      complexityLevel: "medium",
      benefits: "Tourism certificate, English language practice, networking",
      benefitsAz: "Turizm sertifikatı, ingilis dili təcrübəsi, şəbəkə genişlənməsi",
      requirements: "Knowledge of Azerbaijani history, communication skills, B1+ English",
      requirementsAz: "Azərbaycan tarixi bilgisi, ünsiyyət bacarığı, B1+ ingilis dili",
      requiredSkills: ["Communication", "History knowledge", "Multilingualism"],
      isActive: true,
      deadline: "20.04.2026",
      spotsLeft: "Limited availability",
      spotsLeftAz: "Məhdud yerlər"
    },
    {
      title: "Digital Literacy for Elderly Citizens",
      titleAz: "Rəqəmsal Savadlılıq — Yaşlılar üçün",
      description: "Teaching elderly citizens in various Baku neighborhoods how to use smartphones, the internet and government e-services.",
      descriptionAz: "Bakının müxtəlif yaşayış məntəqələrindəki yaşlı vətəndaşlara smartfon, internet və dövlət xidmətlərindən istifadəni öyrətmək.",
      location: "Baku, Nasimi District",
      locationAz: "Bakı, Nəsimi rayonu",
      category: "Technical",
      complexityLevel: "low",
      benefits: "IT teaching certificate, volunteer hours, reference letter",
      benefitsAz: "IT müəllimlik sertifikatı, könüllülük saatı, referans məktubu",
      requirements: "Computer skills, patience, ability to explain clearly",
      requirementsAz: "Kompüter bacarığı, səbir, izahetmə qabiliyyəti",
      requiredSkills: ["IT knowledge", "Teaching", "Empathy"],
      isActive: true,
      deadline: "12.04.2026",
      spotsLeft: "7 slots remaining",
      spotsLeftAz: "7 boş yer qalıb"
    },
    {
      title: "Clean the Caspian Shore",
      titleAz: "Xəzər Sahilini Təmizləyək",
      description: "Cleaning Baku's Caspian coastline, especially the Novkhani and Pirəkəşkül areas. Collecting plastic waste and delivering it to recycling centers.",
      descriptionAz: "Xəzər dənizinin Bakı sahillərinin, xüsusilə Novxanı və Pirəkəşkül ərazilərininin təmizlənməsi. Plastik tullantıların toplanması və emal mərkəzinə çatdırılması.",
      location: "Baku, Khazar District — Novkhani Coast",
      locationAz: "Bakı, Xəzər rayonu — Novxanı sahili",
      category: "Environmental",
      complexityLevel: "low",
      benefits: "Environmental certificate, volunteer t-shirt and equipment",
      benefitsAz: "Ətraf mühit sertifikatı, könüllü köynəyi və ləvazimatlar",
      requirements: "14+ years old, physically active",
      requirementsAz: "14+ yaş, fiziki aktivlik",
      requiredSkills: ["Physical activity", "Ecological awareness", "Team spirit"],
      isActive: true,
      deadline: "18.04.2026",
      spotsLeft: "Last 10 spots!",
      spotsLeftAz: "Son 10 yer!"
    },
    {
      title: "Coding Classes at Children's Homes",
      titleAz: "Uşaq Evlərində Kodlaşdırma Dərsləri",
      description: "Teaching Scratch, HTML/CSS and Python programming to children aged 10-17 living in Baku orphanages.",
      descriptionAz: "Bakı şəhərindəki uşaq evlərində yaşayan 10-17 yaş arası uşaqlara Scratch, HTML/CSS və Python proqramlaşdırma dilləri öyrədilməsi.",
      location: "Baku, Sabunchi District",
      locationAz: "Bakı, Sabunçu rayonu",
      category: "Technical",
      complexityLevel: "medium",
      benefits: "Technical teaching certificate, portfolio project, STEM reference",
      benefitsAz: "Texniki müəllimlik sertifikatı, portfel layihəsi, STEM referansı",
      requirements: "Programming knowledge (any language), willingness to work with children",
      requirementsAz: "Proqramlaşdırma biliyi (istənilən dil), uşaqlarla işləmə istəyi",
      requiredSkills: ["Programming", "Teaching", "Creativity"],
      isActive: true,
      deadline: "25.04.2026",
      spotsLeft: "Only 3 teachers needed",
      spotsLeftAz: "Cəmi 3 müəllim axtarılır"
    },
    {
      title: "Cultural Heritage — Photo Archive Project",
      titleAz: "Mədəni Miras — Foto Arxiv Layihəsi",
      description: "Creating a digital archive by photographing historical buildings, monuments and cultural sites in and around Baku.",
      descriptionAz: "Bakı və ətrafındakı tarixi binaların, abidələrin və mədəni məkanların yüksək keyfiyyətli şəkillərinin çəkilərək rəqəmsal arxiv yaradılması.",
      location: "Baku, Absheron Peninsula",
      locationAz: "Bakı, Abşeron yarımadası",
      category: "Social",
      complexityLevel: "low",
      benefits: "Photographer certificate, name in archive credits, portfolio material",
      benefitsAz: "Fotograf sertifikatı, arxivdə ad qeydiyyatı, portfolio material",
      requirements: "Camera or good camera phone, creativity",
      requirementsAz: "Fotoaparat və ya yaxşı kamera telefon, yaradıcılıq",
      requiredSkills: ["Photography", "Historical interest", "Digital editing"],
      isActive: true,
      deadline: "05.05.2026",
      spotsLeft: "8 spaces left",
      spotsLeftAz: "8 yer qalıb"
    },
    {
      title: "English Language Club with School Students",
      titleAz: "Məktəblilərlə İngilis Dili Klubu",
      description: "Free English communication classes for students in public schools in Baku's outer districts. Through games, debates and film discussions.",
      descriptionAz: "Bakının kənar rayonlarındakı dövlət məktəblərinin şagirdlərinə pulsuz ingilis dili ünsiyyət dərsləri. Oyunlar, debatlar və film müzakirələri vasitəsilə.",
      location: "Baku, Surakhani District",
      locationAz: "Bakı, Suraxanı rayonu",
      category: "Educational",
      complexityLevel: "medium",
      benefits: "Teaching certificate, recommendation letter, pedagogical experience",
      benefitsAz: "Tədris sertifikatı, tövsiyə məktubu, pedaqoji təcrübə",
      requirements: "C1 English, communication skills, enthusiasm",
      requirementsAz: "C1 ingilis dili, kommunikasiya bacarığı, entuziazm",
      requiredSkills: ["English language", "Teaching", "Communication with children"],
      isActive: true,
      deadline: "10.05.2026",
      spotsLeft: "Limited spots",
      spotsLeftAz: "Məhdud yerlər"
    },
    {
      title: "Food Bank — Support for Low-Income Families",
      titleAz: "Qida Bankı — Aztəminatlılara Dəstək",
      description: "Collecting, preparing and delivering food packages for low-income families in various Baku districts. In collaboration with DOST Centers.",
      descriptionAz: "Bakının müxtəlif rayonlarındakı aztəminatlı ailələr üçün ərzaq paketlərinin toplanması, hazırlanması və çatdırılması. DOST Mərkəzləri ilə birgə.",
      location: "Baku, Garadagh District",
      locationAz: "Bakı, Qaradağ rayonu",
      category: "Social",
      complexityLevel: "low",
      benefits: "Social service certificate, DOST Center reference",
      benefitsAz: "Sosial xidmət sertifikatı, DOST Mərkəzi referansı",
      requirements: "18+ years old, reliability, empathy",
      requirementsAz: "18+ yaş, etibarlılıq, empati",
      requiredSkills: ["Logistics", "Empathy", "Teamwork"],
      isActive: true,
      deadline: "14.05.2026",
      spotsLeft: "Need 12 volunteers",
      spotsLeftAz: "12 könüllü axtarılır"
    },
    {
      title: "Young Journalists School",
      titleAz: "Gənc Jurnalistlər Məktəbi",
      description: "Volunteer journalists preparing articles, video reports and podcasts highlighting social issues of Baku youth. For AzVolunteer's media channel.",
      descriptionAz: "Könüllü jurnalistlər tərəfindən Bakı gənclərinin sosial problemlərini işıqlandıran məqalə, video reportaj və podcast hazırlanması. AzVolunteer media kanalı üçün.",
      location: "Baku, Narimanov District",
      locationAz: "Bakı, Nərimanov rayonu",
      category: "Technical",
      complexityLevel: "high",
      benefits: "Media portfolio, journalism certificate, platform exposure",
      benefitsAz: "Media portfeli, jurnalistika sertifikatı, platforma çıxışı",
      requirements: "Writing/video/audio skills, creativity, ability to work independently",
      requirementsAz: "Yazı/video/audio bacarığı, yaradıcılıq, müstəqil işləmə qabiliyyəti",
      requiredSkills: ["Journalism", "Video editing", "Creative writing"],
      isActive: true,
      deadline: "30.04.2026",
      spotsLeft: "Only 2 spots left!",
      spotsLeftAz: "Son 2 yer qalıb!"
    },
    {
      title: "Sumgait — Coastal Ecology Bridge",
      titleAz: "Sumqayıt — Çimərlik Ekoloji Körpüsü",
      description: "Cleaning and ecological monitoring of beach areas in Sumgait city that suffer from industrial pollution.",
      descriptionAz: "Sumqayıt şəhərinin sənaye çirklənməsindən əziyyət çəkən çimərlik zonalarının təmizlənməsi və ekoloji monitorinqi.",
      location: "Sumgait, Coastal Area",
      locationAz: "Sumqayıt, Çimərlik ərazisi",
      category: "Environmental",
      complexityLevel: "medium",
      benefits: "Ecological monitoring certificate, transportation support (from Baku)",
      benefitsAz: "Ekoloji monitorinq sertifikatı, nəqliyyat dəstəyi (Bakıdan)",
      requirements: "16+ years old, physical endurance, ecological sensitivity",
      requirementsAz: "16+ yaş, fiziki dözümlülük, ekoloji həssaslıq",
      requiredSkills: ["Environmental monitoring", "Physical activity", "Report writing"],
      isActive: true,
      deadline: "15.05.2026",
      spotsLeft: "Huge demand! 20+ spots",
      spotsLeftAz: "Böyük tələbat! 20+ yer"
    },
    {
      title: "Psychological Support Line — Online Volunteering",
      titleAz: "Psixoloji Dəstək Xətti — Onlayn Könüllülük",
      description: "Providing initial psychological support via online chat to young people experiencing education, family and stress issues. Under the supervision of professional psychologists.",
      descriptionAz: "Təhsil, ailə və stres problemləri yaşayan gənclərə onlayn chat vasitəsilə ilkin psixoloji dəstək verilməsi. Peşəkar psixoloqların nəzarəti altında.",
      location: "Online — Baku-based",
      locationAz: "Onlayn — Bakı əsaslı",
      category: "Social",
      complexityLevel: "high",
      benefits: "Psychology certificate, professional supervision, CV advantage",
      benefitsAz: "Psixologiya sertifikatı, professional superviziya, CV üstünlüyü",
      requirements: "Psychology/social work education, emotional stability, confidentiality",
      requirementsAz: "Psixologiya/sosial iş təhsili, emosional sabitlik, məxfilik",
      requiredSkills: ["Active listening", "Empathy", "Psychological knowledge"],
      isActive: true,
      deadline: "10.04.2026",
      spotsLeft: "Only 4 specialists left",
      spotsLeftAz: "Cəmi 4 mütəxəssis yeri qalıb"
    },
    {
      title: "Animal Welfare — Street Animal Care",
      titleAz: "Heyvandostluq — Küçə Heyvanlarına Qulluq",
      description: "Setting up feeding stations for street dogs and cats in various Baku districts, organizing veterinary examinations and finding new adoptive homes.",
      descriptionAz: "Bakının müxtəlif rayonlarında küçə it və pişiklərin yemləndirici stansiyalarının qurulması, veterinar müayinəsinin təşkili və yeni ev sahiblərinin tapılması.",
      location: "Baku, Yasamal District",
      locationAz: "Bakı, Yasamal rayonu",
      category: "Social",
      complexityLevel: "low",
      benefits: "Animal welfare certificate, veterinary experience opportunity",
      benefitsAz: "Heyvan refahı sertifikatı, veterinar təcrübəsi imkanı",
      requirements: "Love for animals, responsibility, consistency",
      requirementsAz: "Heyvanlara məhəbbət, məsuliyyət, ardıcıllıq",
      requiredSkills: ["Animal care", "Logistics", "Social media (for outreach)"],
      isActive: true,
      deadline: "12.05.2026",
      spotsLeft: "Plenty of room!",
      spotsLeftAz: "Yer çoxdur!"
    },
    {
      title: "Industrial Waste Water Treatment Analysis",
      titleAz: "Sənaye Tullantı Sularının Təmizlənməsi Analizi",
      description: "Monitoring and analyzing the efficiency of waste water treatment systems in Sumgait's industrial zone. Involves sampling and laboratory testing.",
      descriptionAz: "Sumqayıt sənaye zonasında çirkab sularının təmizlənməsi sistemlərinin səmərəliliyinin monitorinqi və analizi. Nümunə götürülməsi və laboratoriya testlərini əhatə edir.",
      location: "Sumgait, STP (Sumgait Technologies Park)",
      locationAz: "Sumqayıt, STP",
      category: "Technical",
      complexityLevel: "high",
      benefits: "Chemical analysis certificate, lab experience, industrial networking",
      benefitsAz: "Kimyəvi analiz sertifikatı, laboratoriya təcrübəsi, sənaye şəbəkəsi",
      requirements: "Chemistry or Chemical Engineering student, basic lab safety knowledge",
      requirementsAz: "Kimya və ya Kimya Mühəndisliyi tələbəsi, əsas laboratoriya təhlükəsizliyi bilgisi",
      requiredSkills: ["Chemical analysis", "Laboratory safety", "Data recording"],
      isActive: true,
      deadline: "22.04.2026",
      spotsLeft: "Only 2 lab spots!",
      spotsLeftAz: "Cəmi 2 laboratoriya yeri!"
    },
    {
      title: "Petroleum Refining Process Simulator Workshop",
      titleAz: "Neft Emalı Proseslərinin Simulyasiyası Seminarı",
      description: "Assisting in the development and testing of digital models for petroleum distillation and refining processes at SOCAR facilities.",
      descriptionAz: "SOCAR obyektlərində neftin distilləsi və emal prosesləri üçün rəqəmsal modellərin hazırlanmasında və sınaqdan keçirilməsində iştirak.",
      location: "Baku, Heydar Aliyev Oil Refinery",
      locationAz: "Bakı, Heydər Əliyev adına Neft Emalı Zavodu",
      category: "Technical",
      complexityLevel: "high",
      benefits: "Refining technology certificate, industry experience, career mentorship",
      benefitsAz: "Emal texnologiyası sertifikatı, sənaye təcrübəsi, karyera mentorluğu",
      requirements: "3rd or 4th year Chemical Engineering student, knowledge of thermodynamics",
      requirementsAz: "3-cü və ya 4-cü kurs Kimya Mühəndisliyi tələbəsi, termodinamika bilgisi",
      requiredSkills: ["Process simulation", "Thermodynamics", "Analytic thinking"],
      isActive: true,
      deadline: "28.04.2026",
      spotsLeft: "Limited to 5 experts",
      spotsLeftAz: "5 mütəxəssis üçün məhduddur"
    },
    {
      title: "Green Chemistry Initiative - Lab Development",
      titleAz: "Yaşıl Kimya Təşəbbüsü - Laboratoriya İnkişafı",
      description: "Developing and testing eco-friendly chemical reactions for university lab courses to reduce hazardous waste production.",
      descriptionAz: "Təhlükəli tullantıların həcmini azaltmaq üçün universitet laboratoriya kursları üçün ekoloji cəhətdən təmiz kimyəvi reaksiyaların hazırlanması və sınaqdan keçirilməsi.",
      location: "Baku, State Oil and Industry University (ASOIU)",
      locationAz: "Bakı, ADNSU",
      category: "Educational",
      complexityLevel: "medium",
      benefits: "Sustainable chemistry certificate, research experience, academic credit",
      benefitsAz: "Davamlı kimya sertifikatı, tədqiqat təcrübəsi, akademik kredit",
      requirements: "Interest in sustainable chemistry, good academic standing",
      requirementsAz: "Davamlı kimyaya maraq, yaxşı akademik göstəricilər",
      requiredSkills: ["Research", "Green chemistry", "Laboratory work"],
      isActive: true,
      deadline: "10.05.2026",
      spotsLeft: "4 openings left",
      spotsLeftAz: "4 vakansiya qalıb"
    },
    {
      title: "Polymer Quality Control Assistant",
      titleAz: "Polimer Keyfiyyətinə Nəzarət Assistentliyi",
      description: "Learning and assisting in the mechanical and chemical testing of plastic materials produced in Sumgait Chemical Industrial Park.",
      descriptionAz: "Sumqayıt Kimya Sənaye Parkında istehsal olunan plastik materialların mexaniki və kimyəvi sınaqlarının öyrənilməsi və assistentlik edilməsi.",
      location: "Sumgait, Chemical Industrial Park",
      locationAz: "Sumqayıt, Kimya Sənaye Parkı",
      category: "Technical",
      complexityLevel: "medium",
      benefits: "Quality assurance certificate, hands-on production experience",
      benefitsAz: "Keyfiyyət təminatı sertifikatı, istehsalat təcrübəsi",
      requirements: "Knowledge of organic chemistry and polymers",
      requirementsAz: "Üzvi kimya və polimerlər haqqında bilik",
      requiredSkills: ["Quality control", "Polymer science", "Testing equipment"],
      isActive: true,
      deadline: "15.04.2026",
      spotsLeft: "3 spots remaining",
      spotsLeftAz: "3 yer qalıb"
    },
    {
      title: "Corrosion Prevention in Caspian Pipelines",
      titleAz: "Xəzər Boru Kəmərlərində Korroziyanın Qarşısının Alınması",
      description: "Studying the effects of Caspian seawater on steel pipelines and applying innovative protective coatings to prevent corrosion.",
      descriptionAz: "Xəzər dənizi suyuna məruz qalan polad boru kəmərlərinə təsirinin öyrənilməsi və korroziyanın qarşısını almaq üçün innovativ qoruyucu örtüklərin tətbiqi.",
      location: "Baku, Sangachal Terminal Area",
      locationAz: "Bakı, Səngəçal terminalı ətrafı",
      category: "Technical",
      complexityLevel: "high",
      benefits: "Corrosion engineering certificate, offshore safety training",
      benefitsAz: "Korroziya mühəndisliyi sertifikatı, dənizdə təhlükəsizlik təlimi",
      requirements: "Chemistry/Materials Science student, physically fit for field work",
      requirementsAz: "Kimya/Materialşünaslıq tələbəsi, sahə işi üçün fiziki yararlılıq",
      requiredSkills: ["Electrochemistry", "Materials science", "Corrosion testing"],
      isActive: true,
      deadline: "01.05.2026",
      spotsLeft: "Only 6 spots left!",
      spotsLeftAz: "Cəmi 6 yer qalıb!"
    },
    {
      title: "Renewable Biofuels Pilot Project",
      titleAz: "Bərpa Olunan Bioyanacaq Pilot Layihəsi",
      description: "Participating in a laboratory-scale project to produce biodiesel from used cooking oil collected from Baku restaurants.",
      descriptionAz: "Bakı restoranlarından toplanan işlənmiş bişirmə yağlarından biodizel istehsalı üzrə laboratoriya miqyaslı layihədə iştirak.",
      location: "Baku, Research Institute of Chemical Additives",
      locationAz: "Bakı, Aşqarlar Kimyası İnstitutu",
      category: "Environmental",
      complexityLevel: "medium",
      benefits: "Bio-energy certificate, sustainable fuels expertise, startup opportunity",
      benefitsAz: "Bio-enerji sertifikatı, davamlı yanacaq ekspertizası, startup imkanı",
      requirements: "Basic knowledge of organic synthesis and bio-renewable energy",
      requirementsAz: "Üzvi sintez və bərpa olunan bio-enerji haqqında əsas biliklər",
      requiredSkills: ["Organic synthesis", "Bio-energy knowledge", "Laboratory techniques"],
      isActive: true,
      deadline: "08.05.2026",
      spotsLeft: "Limited availability",
      spotsLeftAz: "Məhdud yerlər"
    }
  ];

  // Clear data safely
  await prisma.notification.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.project.deleteMany({});

  for (const project of projects) {
    await prisma.project.create({
      data: project,
    });
  }

  console.log(`✅ ${projects.length} realistic projects created`);
  console.log('🎉 Seeding complete!');
  console.log('\nAdmin credentials:');
  console.log('  Email: maqa10573@gmail.com');
  console.log('  Password: Leomaqa02.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
