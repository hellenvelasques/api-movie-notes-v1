require("express-async-errors");
require("dotenv/config");
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload");
const cors = require("cors");

const express = require("express");
const routes = require("./routes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));
app.use(routes);

app.use(( error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  };

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server ir running on Port ${PORT}`));