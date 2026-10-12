
const prisma = require("../lib/prisma");

const createProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const userId = req.user.userId;
    const role = req.user.role;

    // --------------------------------
    // JOB SEEKER
    // --------------------------------
    if (role === "JOB_SEEKER") {
      const {
        name,
        phone,
        location,
        skills,
        experience,
        currentSalary,
        expectedSalary,
        noticePeriod,
        githubUrl,
        linkedinUrl,
        jobPreferences,
        bio,
      } = req.body;

      // FormData sends values as strings.
      // Prisma expects experience as Int.
      const experienceValue = experience
        ? Number(experience)
        : null;

      // Salary fields are String in Prisma.
      const currentSalaryValue = currentSalary || null;
      const expectedSalaryValue = expectedSalary || null;

      // Get uploaded files
      const photo = req.files?.photo
        ? req.files.photo[0].filename
        : null;

      const resumeUrl = req.files?.resumeUrl
        ? req.files.resumeUrl[0].filename
        : null;

      const profile = await prisma.profile.create({
        data: {
          userId,
          name,
          photo,
          phone,
          location,
          skills,
          experience: experienceValue,
          currentSalary: currentSalaryValue,
          expectedSalary: expectedSalaryValue,
          noticePeriod,
          githubUrl,
          resumeUrl,
          linkedinUrl,
          jobPreferences,
          bio,
        },
      });

      return res.status(201).json({
        message: "Profile created successfully",
        profile,
      });
    }

    // --------------------------------
    // RECRUITER
    // --------------------------------
    if (role === "RECRUITER") {
      const {
        name,
        phone,
        location,
        linkedinUrl,
        bio,
        companyName,
        companyWebsite,
        companyDescription,
      } = req.body;

      const photo = req.files?.photo
        ? req.files.photo[0].filename
        : null;

      const companyLogo = req.files?.companyLogo
        ? req.files.companyLogo[0].filename
        : null;

const profile = await prisma.profile.upsert({
  where: {
    userId: userId,
  },

  create: {
    userId,
    name,
    photo,
    phone,
    location,
    linkedinUrl,
    bio,
    companyName,
    companyWebsite,
    companyDescription,
    companyLogo,
  },

  update: {
    name,
    photo,
    phone,
    location,
    linkedinUrl,
    bio,
    companyName,
    companyWebsite,
    companyDescription,
    companyLogo,
  },
});
      return res.status(201).json({
        message: "Profile created successfully",
        profile,
      });
    }

    // --------------------------------
    // INVALID ROLE
    // --------------------------------
    return res.status(400).json({
      message: "Invalid user role",
    });

  } catch (error) {
    console.error("CREATE PROFILE ERROR:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = createProfile;