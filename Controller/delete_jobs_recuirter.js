const prisma = require("../lib/prisma");

const deleteJob = async (req, res) => {
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

    // Check job ownership
    if (job.recruiterId !== recruiterId) {
      return res.status(403).json({
        message: "You can only delete your own jobs"
      });
    }

    await prisma.job.delete({
      where: {
        id: Number(id)
      }
    });

    res.status(200).json({
      message: "Job deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = deleteJob;