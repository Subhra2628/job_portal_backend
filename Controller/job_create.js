const prisma = require("../lib/prisma");
const categories=require("../Utils/Category");
const createJob = async (req, res) => {
  try {
    const recruiterId = req.user.userId;

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

    // Check required fields
    if (!title || !company || !location || !description) {
      return res.status(400).json({
        message: "Title, company, location and description are required",
      });
    }
     // Check category
    if (!categories.includes(category)) {
      return res.status(400).json({
        message: "Invalid job category",
      });
    }

    const job = await prisma.job.create({
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
        vacancies: vacancies || 1,
        deadline: deadline ? new Date(deadline) : null,
        recruiterId,
      },
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

//Get All Jobs
const getJobs = async (req, res) => {
  try {
//Pagination 
const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const jobs = await prisma.job.findMany({
           skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      message: "Jobs fetched successfully",
      jobs,
       page,
      limit,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {createJob,getJobs};