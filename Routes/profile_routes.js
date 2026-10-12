const express = require("express");

const createProfile = require("../Controller/profile");
const verifyUser = require("../Middleware/auth_middleware");
const { verifyRecruiter, verifyJobSeeker}=require("../Middleware/role");
//import profile
const getprofile=require("../Controller/get_profile");

//import download files
const downloads=require("../Controller/download_resume");


//import get applied jobs by seeker
const seekApply=require("../Controller/check_applied_jobs_by_seeker");

//import update profile
const updateProfile=require("../Controller/update_profile");

//import imageshow
const imageShow =require("../Controller/image_show");

//import multer middleware
const uploads=require("../Upload_file/common");
const router = express.Router();

router.post("/job-seeker", verifyUser, verifyJobSeeker,  uploads.fields([
    { name: "photo", maxCount: 1 },
    { name: "resumeUrl", maxCount: 1 },
  ]), createProfile);

router.post( "/recruiter", verifyUser, verifyRecruiter,   uploads.fields([
{ name: "photo", maxCount: 1 },
{ name: "companyLogo", maxCount: 1 },
]), createProfile);
router.get(
  "/me",
  verifyUser,
  getprofile
);
router.put(
  "/me",
  verifyUser,
  uploads.fields([
    { name: "photo", maxCount: 1 },
    { name: "resumeUrl", maxCount: 1 },
  ]),
  updateProfile
);

//get applied jobs by seeker
router.get("/applieddd", verifyUser,
  verifyJobSeeker,seekApply);

//get and show image 
router.get("/show/:filename",imageShow);

//get upload resume
router.get("/downloading/:filename",downloads);

module.exports = router;