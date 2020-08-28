const appRouter = require("express").Router();
const fs = require("fs");

const platform = process.platform;

const getFilePath = (os) =>
  os.toLowerCase().includes("linux")
    ? "/var/lib/dpkg/status"
    : `./client/assets/file/status.real`;

appRouter.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/index.html"));
});

appRouter.get("/api/file", (req, res) => {
  let filePath = getFilePath(platform);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (!platform.toLowerCase().includes("linux")) {
      filePath = "status.real (Sample file)";
    }

    res.json({ platform, filePath, data });
  });
});

appRouter.get("/*", (req, res) => {
  res.send(`<div>
    <h1>Not Found</h1>
    <a href="/">Go back</a>
  </div>`);
});

module.exports = appRouter;
