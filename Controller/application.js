const prisma = require("../lib/prisma");

// Apply for a job
const applyJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { jobId } = req.params;

    // Check job exists
    const job = await prisma.job.findUnique({
      where: {
        id: Number(jobId),
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

// Check if all vacancies are filled
const selectedCount = await prisma.application.count({
  where: {
    jobId: Number(jobId),
    status: "SELECTED",
  },
});

if (selectedCount >= job.vacancies) {
  return res.status(400).json({
    message: "All vacancies for this job have been filled",
  });
}

    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        userId_jobId: {
          userId: userId,
          jobId: Number(jobId),
        },
      },
    });

    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied for this job",
      });
    }
    if (!job.isActive) {
  return res.status(400).json({
    message: "This job is no longer active",
  });
}

if (job.deadline && new Date() > job.deadline) {
  return res.status(400).json({
    message: "Application deadline has passed",
  });
}

    // Create application
    const application = await prisma.application.create({
      data: {
        userId: userId,
        jobId: Number(jobId),
      },
    });

    res.status(201).json({
      message: "Job application submitted successfully",
      application,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = applyJob;
