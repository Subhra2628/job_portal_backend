

const prisma = require("../lib/prisma");

const getJobApplicants = async (req, res) => {
  try {
    // 1. Get the IDs from the request
    const recruiterId = req.user.userId;
    const jobId = parseInt(req.params.jobId, 10);

    // 2. Validate the input to make sure it's a real number
    if (isNaN(jobId) || jobId <= 0) {
      return res.status(400).json({
        message: "Please provide a valid Job ID.",
      });
    }

    // 3. Look up the job in the database
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    // 4. Handle the case where the job doesn't exist
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    // 5. Security check: Only the recruiter who created the job can view it
    if (job.recruiterId !== recruiterId) {
      return res.status(403).json({
        message: "You can only view applicants for your own job postings.",
      });
    }

    // 6. Fetch the applicants with their profile and resume details
    const applicants = await prisma.application.findMany({
      where: {
        jobId: jobId,
      },
      include: {
        user: {
          include: {
            profile: true,
            resume: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Shows newest applications first
      },
    });

    // 7. Send the data back to the frontend
    return res.status(200).json({
      message: "Applicants fetched successfully",
      totalApplicants: applicants.length,
      applicants: applicants,
    });
    
  } catch (error) {
    // 8. Catch and log any server crashes
    console.error("Error in getJobApplicants:", error);
    
    return res.status(500).json({
      message: "Something went wrong on the server. Please try again later.",
    });
  }
};

module.exports = getJobApplicants;