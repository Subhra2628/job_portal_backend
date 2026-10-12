const prisma = require("../lib/prisma");

const getMyJobs = async (req, res) => {
  try {
    const recruiterId = req.user.userId;

    const jobs = await prisma.job.findMany({
      where: {
        recruiterId: recruiterId
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.status(200).json({
      message: "My jobs fetched successfully",
      jobs
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = getMyJobs;