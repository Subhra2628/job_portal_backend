// DELETE MY RESUME
const prisma = require("../lib/prisma");

const deleteResume = async (req, res) => {
  try {
    const userId = req.user.userId;

    const existingResume = await prisma.resume.findUnique({
      where: {
        userId,
      },
    });

    if (!existingResume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    await prisma.resume.delete({
      where: {
        userId,
      },
    });

    res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports=deleteResume;