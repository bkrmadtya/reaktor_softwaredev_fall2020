const express = require("express");
const app = express();

const appRouter = require("./routes/appRouter");

app.use(express.static(__dirname + "/client"));

app.use("/", appRouter);

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
