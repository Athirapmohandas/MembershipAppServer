const express = require("express");
const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const routes = require("./routes");
const path = require("path");
const app = express();
require("./jobs/reminder.job");
require("./jobs/expiry.job");


app.use(cors());
// app.use(helmet());
// app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

app.get("/", (req, res) => res.json({ message: "Membership Management API" }));

module.exports = app;
