/**
 * Calculates a technical matching score for chemical engineers
 * based on their profile skills vs available project requirements
 */
function calculateTechnicalScore(chemicalProfile, projects = []) {
  if (!chemicalProfile) return null;

  const allProjectSkills = projects.flatMap((p) => [
    ...p.requiredSkills,
    ...p.requiredSoftware,
  ]);

  const userSkills = [
    ...chemicalProfile.softwareSkills,
    ...chemicalProfile.laboratorySkills,
    ...chemicalProfile.industrialSkills,
  ].map((s) => s.toLowerCase());

  if (allProjectSkills.length === 0) return 0;

  const matches = allProjectSkills.filter((skill) =>
    userSkills.some(
      (us) => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us)
    )
  );

  const score = Math.round((matches.length / allProjectSkills.length) * 100);
  return Math.min(score, 100);
}

module.exports = { calculateTechnicalScore };
