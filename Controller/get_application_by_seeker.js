const prisma = require("../lib/prisma");

const getMyApplications = async (req, res) => {
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

    res.status(200).json({
      message: "Applications fetched successfully",
      applications,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = getMyApplications;