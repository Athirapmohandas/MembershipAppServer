const express = require("express")
const router = express.Router()
// const { getDashboardStats } = require("../controllers/dashboard.controller");
const {
    getActiveMembers,
    getTotalMembers,
    getPendingRenewals,
    getRecentPayments,
    getMembershipDistribution,
} = require("../../controllers/admin/dashboard.controller")
const { authenticate, isAdmin, isMember } = require("../../middleware/auth")

// /**
//  * @swagger
//  * /api/admin/dashboard/summary:
//  *   get:
//  *     summary: Get dashboard summary
//  *     tags: [Events]
//  *     responses:
//  *       200:
//  *         description: Dashboard summary including total members, active members, pending renewals, recent payments, and membership distribution
//  */
// router.get("/dashboard/summary", dashboardController.getDashboardSummary);

/**
 * @swagger
 * /api/admin/dashboard/total-members:
 *   get:
 *     summary: Get total number of members
 *     tags: [Admin - Dashboard]
 *     responses:
 *       200:
 *         description: Total members
 */
router.get("/total-members", authenticate, isAdmin, getTotalMembers)

/**
 * @swagger
 * /api/admin/dashboard/active-members:
 *   get:
 *     summary: Get total number of active members
 *     tags: [Admin - Dashboard]
 *     responses:
 *       200:
 *         description: Active members
 */
router.get("/active-members", authenticate, isAdmin, getActiveMembers)

/**
 * @swagger
 * /api/admin/dashboard/pending-renewals:
 *   get:
 *     summary: Get total number of pending renewals
 *     tags: [Admin - Dashboard]
 *     responses:
 *       200:
 *         description: Pending renewals
 */
router.get("/pending-renewals", authenticate, isAdmin, getPendingRenewals)

/**
 * @swagger
 * /api/admin/dashboard/recent-payments:
 *   get:
 *     summary: Get recent payments
 *     tags: [Admin - Dashboard]
 *     responses:
 *       200:
 *         description: List of recent payments
 */
router.get("/recent-payments", authenticate, isAdmin, getRecentPayments)

/**
 * @swagger
 * /api/admin/dashboard/membership-distribution:
 *   get:
 *     summary: Get membership distribution by type and by month
 *     tags: [Admin - Dashboard]
 *     responses:
 *       200:
 *         description: Membership distribution data
 */
router.get(
    "/membership-distribution",
    authenticate,
    isAdmin,
    getMembershipDistribution
)

module.exports = router
