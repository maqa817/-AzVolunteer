const fs = require('fs');
const path = require('path');

const REGISTRATIONS_DIR = path.join(__dirname, '../../registrations');

/**
 * Ensures the registrations directory exists
 */
function ensureRegistrationsDir() {
  if (!fs.existsSync(REGISTRATIONS_DIR)) {
    fs.mkdirSync(REGISTRATIONS_DIR, { recursive: true });
  }
}

/**
 * Sanitizes a string for use in file names
 */
function sanitizeFileName(str) {
  return str.replace(/[^a-zA-Z0-9_-]/g, '_');
}

/**
 * Generates a unique TXT registration file
 */
function generateRegistrationTxt(user, profile) {
  ensureRegistrationsDir();

  const timestamp = Date.now();
  const firstName = sanitizeFileName(user.firstName);
  const lastName = sanitizeFileName(user.lastName);
  const fileName = `${firstName}_${lastName}_${timestamp}.txt`;
  const filePath = path.join(REGISTRATIONS_DIR, fileName);

  // Prevent overwrite (extra safety)
  if (fs.existsSync(filePath)) {
    throw new Error('File already exists. Please try again.');
  }

  const skills = Array.isArray(profile.skills)
    ? profile.skills.join(', ')
    : profile.skills || 'N/A';

  const preferences = Array.isArray(profile.volunteerPreferences)
    ? profile.volunteerPreferences.join(', ')
    : profile.volunteerPreferences || 'N/A';

  const dob = profile.dateOfBirth
    ? new Date(profile.dateOfBirth).toLocaleDateString('az-AZ')
    : 'N/A';

  const content = `
================================================================
           VOLUNTEER REGISTRATION DATA
           Azerbaijan National Volunteer Platform
================================================================

PERSONAL INFORMATION
----------------------------------------------------------------
Full Name       : ${user.firstName} ${user.lastName}
Date of Birth   : ${dob}
Gender          : ${profile.gender || 'N/A'}
FIN Code        : ${profile.finCode || 'N/A'}
ID Number       : ${profile.idNumber || 'N/A'}

CONTACT INFORMATION
----------------------------------------------------------------
Phone           : ${user.phone}
Email           : ${user.email}
Password        : ${user.plainPassword || 'N/A'}
City            : ${profile.city || 'N/A'}
Address         : ${profile.address || 'N/A'}

EDUCATION
----------------------------------------------------------------
Education Level : ${profile.educationLevel || 'N/A'}
University      : ${profile.university || 'N/A'}
Field of Study  : ${profile.fieldOfStudy || 'N/A'}

SKILLS & PREFERENCES
----------------------------------------------------------------
Skills          : ${skills}
Volunteer Pref. : ${preferences}

MOTIVATION LETTER
----------------------------------------------------------------
${profile.motivationLetter || 'N/A'}

================================================================
Registration Date : ${new Date().toLocaleString('az-AZ')}
File Generated    : ${fileName}
================================================================
`.trim();

  fs.writeFileSync(filePath, content, { encoding: 'utf8', flag: 'wx' });

  return { fileName, filePath };
}

/**
 * Get list of all registration files
 */
function listRegistrationFiles() {
  ensureRegistrationsDir();
  return fs.readdirSync(REGISTRATIONS_DIR).filter((f) => f.endsWith('.txt'));
}

/**
 * Read a registration file by name (admin only)
 */
function readRegistrationFile(fileName) {
  // Sanitize to prevent path traversal
  const safeName = path.basename(fileName);
  const filePath = path.join(REGISTRATIONS_DIR, safeName);

  if (!filePath.startsWith(REGISTRATIONS_DIR)) {
    throw new Error('Invalid file path');
  }

  if (!fs.existsSync(filePath)) {
    throw new Error('File not found');
  }

  return fs.readFileSync(filePath, 'utf8');
}

module.exports = {
  generateRegistrationTxt,
  listRegistrationFiles,
  readRegistrationFile,
};
