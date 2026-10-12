const prisma = require("../lib/prisma");

const closeJob = async (req, res) => {
  try {
    const recruiterId = req.user.userId;
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    if (job.recruiterId !== recruiterId) {
      return res.status(403).json({
        message: "You can only close your own jobs"
      });
    }

    if (!job.isActive) {
      return res.status(400).json({
        message: "Job is already closed"
      });
    }

    const updatedJob = await prisma.job.update({
      where: {
        id: Number(id)
      },
      data: {
        isActive: false
      }
    });

    res.status(200).json({
      message: "Job closed successfully",
      job: updatedJob
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = closeJob;