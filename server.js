require("dotenv").config();
const app = require("./src/app");
// const sequelize = require("./src/config/db");
const { sequelize } = require("./src/models");

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("Unable to connect to DB:", err);
});
