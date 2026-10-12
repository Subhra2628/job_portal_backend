const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

if (role !== "JOB_SEEKER" && role !== "RECRUITER") {     return res.status(400).json({
        message: "Invalid role",
      });
    }

      const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }
// Check email verification
const otpRecord = await prisma.otpVerification.findFirst({
  where: {
    email,
    verified: true,
  },
  orderBy: {
    createdAt: "desc",
  },
});

if (!otpRecord) {
  return res.status(400).json({
    message: "Please verify your email first",
  });
}
  

    const hashedPassword = await bcrypt.hash(password, 10);

   const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "JOB_SEEKER",
      },
    });

    // Delete OTP after successful registration
    await prisma.otpVerification.deleteMany({
      where: {
        email,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = register;