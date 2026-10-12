const prisma = require("../lib/prisma");

const updateApplicationStatus = async (req, res) => {
  try {
    const recruiterId = req.user.userId;
    const { applicationId } = req.params;
    const { status } = req.body;

    // Allowed statuses
    const allowedStatuses = [
      "PENDING",
      "SHORTLISTED",
      "REJECTED",
      "SELECTED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }

    // Find application
    const application = await prisma.application.findUnique({
      where: {
        id: Number(applicationId),
      },
      include: {
        job: true,
      },
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Check whether recruiter owns the job
    if (application.job.recruiterId !== recruiterId) {
      return res.status(403).json({
        message: "You can only update applications for your own jobs",
      });
    }

    // Update status
    const updatedApplication = await prisma.application.update({
      where: {
        id: Number(applicationId),
      },
      data: {
        status: status,
      },
    });

    res.status(200).json({
      message: "Application status updated successfully",
      application: updatedApplication,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = updateApplicationStatus;