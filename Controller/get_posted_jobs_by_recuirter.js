
const prisma = require("../lib/prisma");

const getMyPostedJobs = async (req, res) => {
  try {
    const recruiterId = req.user.userId;

    // Get all jobs posted by this recruiter
    const jobs = await prisma.job.findMany({
      where: {
        recruiterId: recruiterId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Posted jobs fetched successfully",
      jobs,
    });
  } catch (error) {
    console.error("Error fetching posted jobs:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch posted jobs",
    });
  }
};

module.exports = getMyPostedJobs;

