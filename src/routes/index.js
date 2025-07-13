const express = require("express");
const adminRoutes = require("./admin/member.routes");
const authRoutes = require("./auth.routes");
const eventRoutes = require("./admin/event.routes");
const dashboardRoutes = require("./admin/dashboard.routes");
const memberRoutes = require("./member.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/admin/members", adminRoutes);
router.use("/admin/events", eventRoutes);
router.use("/admin/dashboard", dashboardRoutes);
router.use("/member", memberRoutes);

module.exports = router;