const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Check email
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Check if already subscribed
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: {
        email: email,
      },
    });

    if (existingSubscriber) {
      return res.status(409).json({
        message: "Email is already subscribed",
      });
    }

    // Save email
    const subscriber = await prisma.subscriber.create({
      data: {
        email: email,
      },
    });

    return res.status(201).json({
      message: "Subscribed successfully",
      subscriber,
    });
  } catch (error) {
    console.error(error.response?.data?.message);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = subscribe;