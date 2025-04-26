console.log("Server file loaded");
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// Register API
app.post("/register", upload.single("screenshot"), (req, res) => {
  const { uid, playerName } = req.body;
  const screenshot = req.file ? req.file.filename : null;

  const newEntry = { uid, playerName, screenshot };

  const dataFile = "data.json";
  let data = [];

  if (fs.existsSync(dataFile)) {
    data = JSON.parse(fs.readFileSync(dataFile));
  }

  data.push(newEntry);
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

  res.send("Registration successful!");
});

app.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`);
});
