const prisma = require("../lib/prisma");

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const recruiterId = req.user.userId;

    // Find the job
    const job = await prisma.job.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Check job owner
    if (job.recruiterId !== recruiterId) {
      return res.status(403).json({
        message: "You can only update your own jobs",
      });
    }

    const {
      title,
      company,
      location,
      description,
      salary,
      jobType,
      category,
      experience,
      skills,
      vacancies,
      deadline,
    } = req.body;

    const updatedJob = await prisma.job.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        company,
        location,
        description,
        salary,
        jobType,
        category,
        experience,
        skills,
        vacancies,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = updateJob;