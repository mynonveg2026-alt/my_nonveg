const express = require("express");
require("dotenv").config();

const cors = require("cors");
const path = require("path");

const sequelize = require("./config/db");
require("./models");

const sendResponse = require("./middlewares/response.middleware");
const handleNotFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const productRoutes = require("./routes/product.routes");
const vendorRoutes = require("./routes/vendor.routes");
const userRoutes = require("./routes/user.routes");

const app = express();
const port = process.env.APP_PORT;
const baseUrl = process.env.BASE_URL;

// BODY PARSER
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// STATIC FOLDER
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CUSTOM RESPONSE MIDDLEWARE
app.use(sendResponse);

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/product", productRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/user", userRoutes);
// NOT FOUND MIDDLEWARE
app.use(handleNotFound);

// ERROR HANDLER
app.use(errorHandler);

// SERVER START
async function startServer() {
  try {
    // sync models
    await sequelize.sync({ alter: false });

    console.log("All models synchronized successfully.");

    app.listen(port, () => {
      console.log(`${process.env.APP_NAME} is running on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
}

startServer();
