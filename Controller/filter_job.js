const prisma = require("../lib/prisma");

// Get All Jobs + Filter Jobs
const getJobs = async (req, res) => {
  try {
    const {
      title,
      location,
      category,
      jobType,
      workMode,
      experience,
      skills,
      salary,
      days
    } = req.query;

    const where = {};

    // Title
    if (title) {
      where.title = {
        contains: title
      };
    }

    // Location
    if (location) {
      where.location = {
        contains: location
      };
    }

    // Category
    if (category) {
      where.category = {
        contains: category
      };
    }

    // Job Type
    if (jobType) {
      where.jobType = jobType;
    }

    // Work Mode
    if (workMode) {
      where.workMode = workMode;
    }

    // Experience
    if (experience) {
      where.experience = {
        contains: experience
      };
    }

    // Skills
    if (skills) {
      where.skills = {
        contains: skills
      };
    }

    // Posted within X days
    if (days) {
      where.createdAt = {
        gte: new Date(
          Date.now() - Number(days) * 24 * 60 * 60 * 1000
        )
      };
    }

    // Get jobs from database
    const jobs = await prisma.job.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      }
    });

    // Salary filter
    let filteredJobs = jobs;

    if (salary) {
      filteredJobs = jobs.filter((job) => {

        if (!job.salary) {
          return false;
        }

        // Example:
        // "₹20,000 - ₹30,000"
        const numbers = job.salary.match(/\d[\d,]*/g);

        if (!numbers || numbers.length < 2) {
          return false;
        }

        const minSalary = Number(
          numbers[0].replace(/,/g, "")
        );

        const maxSalary = Number(
          numbers[1].replace(/,/g, "")
        );

        // Below ₹20K
         if (salary === "0-19000") {
          return minSalary < 20000;
        }
        // if (salary === "0-20000") {
        //   return minSalary <= 20000;
        // }

        // ₹20K - ₹30K
        if (salary === "20000-30000") {
          return (
            minSalary <= 30000 &&
            maxSalary >= 20000
          );
        }

        // ₹30K - ₹50K
        if (salary === "30000-50000") {
          return (
            minSalary <= 50000 &&
            maxSalary >= 30000
          );
        }

        // ₹50K+
        if (salary === "50000") {
          return maxSalary >= 50000;
        }

        return false;
      });
    }

    res.status(200).json({
      message: "Jobs fetched successfully",
      jobs: filteredJobs
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = getJobs;