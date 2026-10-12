const path = require("path");

const getImage = (req, res) => {
  const { filename } = req.params;

  const filePath = path.join(
    __dirname,
    "../uploads",
    filename
  );

  res.sendFile(filePath);
};

module.exports = getImage;