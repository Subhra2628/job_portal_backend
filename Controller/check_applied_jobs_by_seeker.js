const prisma = require("../lib/prisma");

const getApplieddJobs = async (req, res) => {
  try {
    const userId = req.user.userId;

    const applications = await prisma.application.findMany({
      where: {
        userId: userId,
      },
      include: {
        job: true,
        
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("APPLICATIONS:", applications);
    res.status(200).json({
      message: "Applied jobs fetched successfully",
      applications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = getApplieddJobs;