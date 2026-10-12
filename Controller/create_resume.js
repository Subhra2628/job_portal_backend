const prisma = require("../lib/prisma");

const createResume = async (req, res) => {
  try {
    const userId = req.user.userId;

    //check the user is recuirter or job seeker
if (req.user.role !== "JOB_SEEKER") {
  return res.status(403).json({
    message: "Only job seekers can create a resume",
  });
}

    const {
      fullName,
      email,
      phone,
      location,
      headline,
      summary,
      linkedin,
      github,
      portfolio,
      education,
      skills,
      experience,
      projects,
      certifications,
      languages,
    } = req.body;

    // Check required fields
    if (!fullName || !email) {
      return res.status(400).json({
        message: "Full name and email are required",
      });
    }

    // Check if resume already exists
    const existingResume = await prisma.resume.findUnique({
      where: {
        userId,
      },
    });

    if (existingResume) {
      return res.status(400).json({
        message: "Resume already exists",
      });
    }

    const resume = await prisma.resume.create({
      data: {
        userId,
        fullName,
        email,
        phone,
        location,
        headline,
        summary,
        linkedin,
        github,
        portfolio,
        education,
        skills,
        experience,
        projects,
        certifications,
        languages,
      },
    });

    res.status(201).json({
      message: "Resume created successfully",
      resume,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports =createResume ;