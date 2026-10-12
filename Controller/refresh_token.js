const jwt = require("jsonwebtoken");

const refreshAccessToken = (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
       console.log("COOKIES:", req.cookies);

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token is required",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    // Create new access token
    const accessToken = jwt.sign(
      {
        userId: decoded.userId,
        role: decoded.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1m",
      }
    );

    res.status(200).json({
      accessToken,
    });

  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};

module.exports = refreshAccessToken;