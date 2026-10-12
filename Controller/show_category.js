const prisma = require("../lib/prisma");

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.job.findMany({
      where: {
        category: {
          not: null,
        },
      },
      select: {
        category: true,
      },
      distinct: ["category"],
      orderBy: {
        category: "asc",
      },
    });

    const categoryNames = categories.map((item) => item.category);

    res.status(200).json({
      message: "Categories fetched successfully",
      category: categoryNames,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = getCategories;