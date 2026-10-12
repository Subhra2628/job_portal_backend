const express = require("express");

// Create router
const router = express.Router();

// Middleware
const verifyUser = require("../Middleware/auth_middleware");
const { verifyRecruiter } = require("../Middleware/role");

// Controllers
const {
  createJob,
  getJobs
} = require("../Controller/job_create");

//Get job by id
const getByid=require("../Controller/get_job_by_id");

//Get job by filter
const getByfilter=require("../Controller/filter_job");
//Update job
const updateJob=require("../Controller/update_job");

//View jobs by recuirter
const view=require("../Controller/view_job_by_recruiter");

//import delete jobs by recuirter
const deletejobs=require("../Controller/delete_jobs_recuirter");

//search title jobs
const searchjobs=require("../Controller/search_jobs");
//import posted job by recuirter
const getpostedByrecuirter=require("../Controller/get_posted_jobs_by_recuirter.js");


//search by location
const searchlocation=require("../Controller/search_by_location");

//import search by title and location both condition
const searchBytitleLocation=require("../Controller/search_by_title_location");
//import close jobs
const closeJobs=require("../Controller/close_job");

//import show category
const category=require("../Controller/show_category");

//import show all job
const showAll=require("../Controller/show_all_jobs")
//import getjobsby category
const getCategory=require("../Controller/search_jobs_by_category");
// Create Job - Recruiter only
router.post(
  "/create-job",
  verifyUser,
  verifyRecruiter,
  createJob
);

// Get All Jobs - Public
router.get(
  "/jobs",
  getJobs
);
//Get jobs by filter
router.get("/jobs/filter",getByfilter);

//get jobs by recuirter
router.get("/getByrecuirteres",verifyUser,verifyRecruiter,getpostedByrecuirter);

//view jobs by recuirter
router.get("/viewjobs",verifyUser,verifyRecruiter,view);
//Get job by id
router.get("/jobs/:id",getByid);

//Update job
router.put("/jobs/update/:id",verifyUser,verifyRecruiter,updateJob);

//close jobs
router.put("/close/:id",verifyUser,verifyRecruiter,closeJobs)
//delete jobs by recuirter
router.delete("/deleted",verifyUser,verifyRecruiter,deletejobs);

//search jobs
router.get("/search",searchjobs);

//search by title and location both condition
router.get("/both",searchBytitleLocation);
//search location
router.get("/location",searchlocation);

//show category
router.get("/category",category);

//get jobs by category
router.get("/getcategory",getCategory)

//show all jobs
router.get("/showAll",showAll);

module.exports = router;