const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const prisma = require('../utils/prisma');
const { signToken } = require('../utils/jwt');
const { generateRegistrationTxt } = require('../utils/fileGenerator');

async function register(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      dateOfBirth,
      gender,
      finCode,
      idNumber,
      city,
      address,
      educationLevel,
      university,
      fieldOfStudy,
      skills,
      volunteerPreferences,
      motivationLetter,
      // Chemical engineering fields
      specialization,
      softwareSkills,
      laboratorySkills,
      industrialSkills,
    } = req.body;

    // Age validation (14+)
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 14) {
        return res.status(400).json({ success: false, message: 'You must be at least 14 years old to register.' });
      }
    }

    // Check duplicates
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const existingPhone = await prisma.user.findUnique({ where: { phone } });
    if (existingPhone) {
      return res.status(409).json({ success: false, message: 'Phone number already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const isChemical =
      fieldOfStudy &&
      fieldOfStudy.toLowerCase().includes('chemical');

    // Transaction: create user + profiles
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          passwordHash,
          plainPassword: password,
          role: 'volunteer',
          status: 'pending',
        },
      });

      const profile = await tx.volunteerProfile.create({
        data: {
          userId: user.id,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender: gender || null,
          finCode: finCode || null,
          idNumber: idNumber || null,
          city: city || null,
          address: address || null,
          educationLevel: educationLevel || null,
          university: university || null,
          fieldOfStudy: fieldOfStudy || null,
          skills: Array.isArray(skills) ? skills : [],
          volunteerPreferences: Array.isArray(volunteerPreferences)
            ? volunteerPreferences
            : [],
          motivationLetter: motivationLetter || null,
        },
      });

      let chemProfile = null;
      if (isChemical) {
        chemProfile = await tx.chemicalProfile.create({
          data: {
            userId: user.id,
            specialization: specialization || null,
            softwareSkills: Array.isArray(softwareSkills) ? softwareSkills : [],
            laboratorySkills: Array.isArray(laboratorySkills) ? laboratorySkills : [],
            industrialSkills: Array.isArray(industrialSkills) ? industrialSkills : [],
          },
        });
      }

      // Create welcome notification
      await tx.notification.create({
        data: {
          userId: user.id,
          title: 'Welcome to AzVolunteer!',
          message:
            'Your registration has been received. An admin will review your profile shortly.',
        },
      });

      return { user, profile, chemProfile };
    });

    // Generate TXT file (non-blocking, don't fail registration if file fails)
    try {
      generateRegistrationTxt(result.user, result.profile);
    } catch (fileErr) {
      console.error('TXT generation failed:', fileErr.message);
    }

    const token = signToken({ userId: result.user.id, role: result.user.role });

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Your profile is under review.',
      token,
      user: {
        id: result.user.id,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email,
        role: result.user.role,
        status: result.user.status,
        isChemicalEngineer: isChemical,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function login(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim(), deletedAt: null },
      include: {
        volunteerProfile: true,
        chemicalProfile: true,
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = signToken({ userId: user.id, role: user.role });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        isChemicalEngineer: !!user.chemicalProfile,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function getMe(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        volunteerProfile: true,
        chemicalProfile: true,
      },
    });

    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = { register, login, getMe };
