const verifyRecruiter = (req, res, next) => {
  if (req.user.role !== "RECRUITER") {
    return res.status(403).json({
      message: "Access denied. Recruiter only.",
    });
  }

  next();
};

const verifyJobSeeker = (req, res, next) => {
  if (req.user.role !== "JOB_SEEKER") {
    return res.status(403).json({
      message: "Access denied. Job seeker only.",
    });
  }

  next();
};

module.exports = {
  verifyRecruiter,
  verifyJobSeeker,
};