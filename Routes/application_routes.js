const express = require("express");

const router = express.Router();

const verifyUser = require("../Middleware/auth_middleware");
const { verifyRecruiter, verifyJobSeeker}=require("../Middleware/role");

//import apply job by seeker
const applyjobs=require("../Controller/application");

//import check applied job
const appliedd=require("../Controller/check_job_applied");

//import jobs by recruiter 
const applied=require("../Controller/get_application-by_recuirter");
//import get application
const getapplied=require("../Controller/get_application_by_seeker");
//import status update
const status=require("../Controller/Status_update");

//import applicant resume
const resumee=require("../Controller/get_resume_by_recuirter");

router.get("/getjobs",verifyUser,verifyJobSeeker,getapplied);

router.get("/byRecruiter/:jobId",verifyUser,verifyRecruiter,applied);

router.patch("/statusUpdate/:applicationId",verifyUser,verifyRecruiter,status);

router.post("/apply/:jobId",verifyUser,verifyJobSeeker,applyjobs);

router.get("/applyy/:jobId",verifyUser,
  verifyJobSeeker,
  appliedd);

  router.get("/resume/:applicationId",verifyUser,
  verifyRecruiter,resumee);
module.exports = router;
