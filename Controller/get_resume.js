const prisma = require("../lib/prisma");

const getMyResume = async (req, res) => {
  try {
    const userId = req.user.userId;

    const resume = await prisma.resume.findUnique({
      where: {
        userId,
      },
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    res.status(200).json({
      message: "Resume fetched successfully",
      resume,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports=getMyResume;