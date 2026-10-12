const prisma = require("../lib/prisma");
const transporter = require("../Config/mail");

// Send OTP
const sendOtp = async (req, res) => {
  try {
    const {  email } = req.body;

    // Check email
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (existingUser) {
  return res.status(409).json({
    message: "This email is already registered. Please login instead.",
  });
}

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP expires after 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Delete old OTP
    await prisma.otpVerification.deleteMany({
      where: {
        email,
      },
    });

    // Save new OTP
    await prisma.otpVerification.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Job Portal - OTP Verification",
      text: `Your OTP is ${otp}. This OTP will expire in 5 minutes.`,
    });

    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to send OTP",
    });
  }
};


// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check required fields
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    // Find OTP
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        email,
        otp,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // OTP not found
    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Check OTP expiration
    if (new Date() > otpRecord.expiresAt) {
      await prisma.otpVerification.delete({
        where: {
          id: otpRecord.id,
        },
      });

      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // OTP is correct
 // Mark OTP as verified
await prisma.otpVerification.update({
  where: {
    id: otpRecord.id,
  },
  data: {
    verified: true,
  },
});

// OTP is correct
res.status(200).json({
  message: "Email verified successfully",
});
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = {
  sendOtp,
  verifyOtp,
};