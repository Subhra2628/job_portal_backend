const prisma = require("../lib/prisma");

const getAllJob = async (req, res) => {
  try {
    

    const job = await prisma.job.findMany({
      
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "Job fetched successfully",
      job,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};  
module.exports = getAllJob;