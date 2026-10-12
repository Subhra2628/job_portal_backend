
const prisma = require("../lib/prisma");
const path = require("path");
const fs = require("fs");

const getApplicantResume = async (req, res) => {
  try {
    const recruiterId = req.user.userId;
    const applicationId = Number(req.params.applicationId);

    if (!Number.isInteger(applicationId) || applicationId <= 0) {
      return res.status(400).json({
        message: "Valid application ID is required",
      });
    }

    // Find the application and its related job and applicant
    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        job: true,
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Only the recruiter who owns this job can access the resume
    if (application.job.recruiterId !== recruiterId) {
      return res.status(403).json({
        message: "You cannot access this applicant's resume",
      });
    }

    const resumeUrl = application.user.profile?.resumeUrl;

    if (!resumeUrl) {
      return res.status(404).json({
        message: "Resume has not been uploaded",
      });
    }

    // Use only the filename, never trust a client-provided file path
    const filename = path.basename(resumeUrl);

    // Update this directory to match your Multer destination
    const resumePath = path.resolve(
      __dirname,
      "../uploads",
      filename
    );

    if (!fs.existsSync(resumePath) || !fs.statSync(resumePath).isFile()) {
      return res.status(404).json({
        message: "Resume file not found on the server",
      });
    }

    const download = req.query.download === "1";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `${download ? "attachment" : "inline"}; filename="${filename}"`
    );
    res.setHeader("X-Content-Type-Options", "nosniff");

    return res.sendFile(resumePath);
  } catch (error) {
    console.error("Error accessing applicant resume:", error);

    return res.status(500).json({
      message: "Failed to access resume",
    });
  }
};

module.exports = getApplicantResume;
