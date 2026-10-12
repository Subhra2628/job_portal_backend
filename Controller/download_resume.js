const path = require("path");

const downloadFile = (req, res) => {
  const { filename } = req.params;

  const filePath = path.join(__dirname, "../uploads", filename);

  res.download(filePath, (err) => {
    if (err) {
      console.log(err);
      res.status(404).json({
        message: "File not found"
      });
    }
  });
};

module.exports = downloadFile;