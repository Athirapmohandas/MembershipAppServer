// server/src/routes/member.mobile.routes.js

const express = require("express");
const router = express.Router();
const memberMobileController = require("../controllers/member.controller");
const { authenticate, isAdmin, isMember } = require("../middleware/auth")

/**
 * @swagger
 * /api/member/profile:
 *   get:
 *     summary: Get member card, next event
 *     tags: [Member Self-Service]
 *     responses:
 *       200:
 *         description: Member home information
 */
router.get("/profile", authenticate, isMember, memberMobileController.getMemberHome);

/**
 * @swagger
 * /api/member/renewal:
 *   get:
 *     summary: Get membership status
 *     tags: [Member Self-Service]
 *     responses:
 *       200:
 *         description: Current membership status
 */
router.get("/renewal", authenticate, isMember, memberMobileController.getRenewalStatus);

/**
 * @swagger
 * /api/member/renew:
 *   post:
 *     summary: Renew membership
 *     tags: [Member Self-Service]
 *     responses:
 *       200:
 *         description: Membership renewed
 */
router.post("/renew",authenticate, isMember, memberMobileController.renewMembership);

/**
 * @swagger
 * /api/member/notifications:
 *   get:
 *     summary: Get notifications for a member
 *     tags: [Member Self-Service]
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get("/notifications", authenticate, isMember, memberMobileController.getNotifications);

/**
 * @swagger
 * /api/member/notifications:
 *   post:
 *     summary: Send General notification 
 *     tags: [Member Self-Service]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification created
 */
router.post("/notifications", authenticate, isMember, memberMobileController.sendNotification);

module.exports = router;
