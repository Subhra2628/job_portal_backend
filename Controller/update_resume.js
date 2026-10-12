// UPDATE MY RESUME
const prisma = require("../lib/prisma");

const updateResume = async (req, res) => {
  try {
    const userId = req.user.userId;

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

    const existingResume = await prisma.resume.findUnique({
      where: {
        userId,
      },
    });

    if (!existingResume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const resume = await prisma.resume.update({
      where: {
        userId,
      },
      data: {
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

    res.status(200).json({
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports=updateResume;
