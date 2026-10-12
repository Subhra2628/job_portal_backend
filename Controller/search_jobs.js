const prisma = require("../lib/prisma");

const searchJobs = async (req, res) => {
  try {
    const { title } = req.query;

    const jobs = await prisma.job.findMany({
      where: {
        title: {
          contains: title,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
if (jobs.length === 0) {
  return res.status(404).json({
    message: "No jobs found",
    jobs: [],
  });
}
    res.status(200).json({
      message: "Jobs fetched successfully",
      jobs,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = searchJobs;