const express = require("express");

const router = express.Router();

//import create resume 
const resumebuild=require("../Controller/create_resume");

//import get resume
const getResume=require("../Controller/get_resume")

//import Update resume
const updateResume=require("../Controller/update_profile");

//import deleet resume
const deleteResume= require("../Controller/delete_resume");
//import middleware
const verifyUser=require("../Middleware/auth_middleware");
const { verifyJobSeeker } = require("../Middleware/role");
router.post("/build",verifyUser,verifyJobSeeker,resumebuild);

router.get("/getResume",verifyUser,verifyJobSeeker,getResume);

router.put("/updateresume",verifyUser,verifyJobSeeker,updateResume);

router.delete("/delete",verifyUser,verifyJobSeeker,deleteResume);

module.exports = router;