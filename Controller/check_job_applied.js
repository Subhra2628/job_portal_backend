const prisma = require("../lib/prisma");

const checkApplication = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobId = Number(req.params.jobId);

    const application = await prisma.application.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    res.status(200).json({
      applied: !!application,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = checkApplication;