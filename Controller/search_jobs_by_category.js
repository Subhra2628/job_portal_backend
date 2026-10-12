const prisma = require("../lib/prisma");

const getJobsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({
        message: "Category is required",
      });
    }

    const jobs = await prisma.job.findMany({
      where: {
        category: {
          equals: category,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (jobs.length === 0) {
      return res.status(404).json({
        message: "No jobs found in this category",
        jobs: [],
      });
    }

    res.status(200).json({
      message: "Category jobs fetched successfully",
      category,
      jobs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = getJobsByCategory;