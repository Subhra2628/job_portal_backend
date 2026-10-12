//import express
const express = require("express");
//import cors
const cors = require("cors");

//import upload files

//import profile picture view

//import cookie parser
const cookieParser = require("cookie-parser");

//import auth routes
const authroutes=require("./Routes/auth_Routes");

//import profile routes
const profiles=require("./Routes/profile_routes");

//import Job create routes
const Job=require("./Routes/job_create_routes");

//import apply jobs
const applyjobs=require("./Routes/application_routes");

//import resumebuild
const resumeBuild=require("./Routes/resume_routes");

//import subscribe route
const subscriber=require("./Routes/Subscribe");
//prisma
const prisma = require("./lib/prisma");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
//middleware
app.use(express.json());

//cookies 
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: "Job Portal API is running",
  });
});
//Auth
app.use("/api/auth",authroutes);
const PORT = process.env.PORT || 5000;

//Profile
app.use("/api/profile",profiles);

//Create Job
app.use("/api/create",Job);

//Apply jobs
app.use("/api",applyjobs);

//create resume
app.use("/api/resume",resumeBuild);

//subscribe email
app.use("/api",subscriber);
//start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});