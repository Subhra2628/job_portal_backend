const prisma = require("../lib/prisma");

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    let profileData = {};

    // =========================
    // JOB SEEKER
    // =========================
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

      // experience -> Int?
      const experienceValue =
        experience === "" || experience == null
          ? null
          : Number(experience);

      // Salary fields -> String?
      const currentSalaryValue =
        currentSalary === "" || currentSalary == null
          ? null
          : currentSalary;

      const expectedSalaryValue =
        expectedSalary === "" || expectedSalary == null
          ? null
          : expectedSalary;

      // Files
      const photo = req.files?.photo
        ? req.files.photo[0].filename
        : undefined;

      const resumeUrl = req.files?.resumeUrl
        ? req.files.resumeUrl[0].filename
        : undefined;

      profileData = {
        name,
        phone,
        location,
        skills,
        experience: experienceValue,
        currentSalary: currentSalaryValue,
        expectedSalary: expectedSalaryValue,
        noticePeriod,
        githubUrl,
        linkedinUrl,
        jobPreferences,
        bio,
      };

      // Only update photo if a new photo was uploaded
      if (photo !== undefined) {
        profileData.photo = photo;
      }

      // Only update resume if a new resume was uploaded
      if (resumeUrl !== undefined) {
        profileData.resumeUrl = resumeUrl;
      }
    }

    // =========================
    // RECRUITER
    // =========================
    if (role === "RECRUITER") {
      const {
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
        : undefined;

      const companyLogo = req.files?.companyLogo
        ? req.files.companyLogo[0].filename
        : undefined;

      profileData = {
        phone,
        location,
        linkedinUrl,
        bio,
        companyName,
        companyWebsite,
        companyDescription,
      };

      // Only update photo if new photo uploaded
      if (photo !== undefined) {
        profileData.photo = photo;
      }

      // Only update company logo if new logo uploaded
      if (companyLogo !== undefined) {
        profileData.companyLogo = companyLogo;
      }
    }

    // =========================
    // INVALID ROLE
    // =========================
    if (role !== "JOB_SEEKER" && role !== "RECRUITER") {
      return res.status(400).json({
        message: "Invalid user role",
      });
    }

    // Check profile exists
    const profile = await prisma.profile.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    // Update profile
    const updatedProfile = await prisma.profile.update({
      where: {
        userId: userId,
      },
      data: profileData,
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = updateProfile;