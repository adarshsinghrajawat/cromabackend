const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

router.get("/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../pdfs", filename);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("❌ PDF not found:", filePath);
      return res.status(404).send("PDF file not found");
    }

    // Set headers to open PDF inline
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

    res.sendFile(filePath);
  });
});

module.exports = router;
