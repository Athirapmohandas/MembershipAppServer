// server/src/routes/event.routes.js

const express = require("express");
const router = express.Router();
const eventController = require("../../controllers/admin/event.controller");
const { authenticate, isAdmin, isMember } = require("../../middleware/auth")

/**
 * @swagger
 * /api/admin/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Admin - Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               entryFee:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Event created successfully
 */
router.post("/", authenticate, isAdmin, eventController.createEvent);

/**
 * @swagger
 * /api/admin/events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Admin - Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event updated successfully
 */
router.put("/:id", authenticate, isAdmin, eventController.updateEvent);

/**
 * @swagger
 * /api/admin/events:
 *   get:
 *     summary: Get list of all events
 *     tags: [Admin - Events]
 *     responses:
 *       200:
 *         description: List of events
 */
router.get("/",authenticate, isAdmin, eventController.getEvents);

/**
 * @swagger
 * /api/admin/events/attendance:
 *   post:
 *     summary: Record member attendance for an event
 *     tags: [Admin - Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: integer
 *               memberId:
 *                 type: integer
 *               attended:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Attendance recorded
 */
router.post("/attendance",authenticate,isAdmin, eventController.recordAttendance);
/**
 * @swagger
 * /api/admin/events/makePayment:
 *   post:
 *     summary: Record Payment for an event
 *     tags: [Admin - Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: integer
 *               memberId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Payment recorded
 */
router.post("/makePayment",authenticate,isAdmin, eventController.makePayment);

/**
 * @swagger
 * /api/admin/events/{eventId}/payments:
 *   get:
 *     summary: Get payments for a specific event
 *     tags: [Admin - Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Payments for event
 */
router.get("/:eventId/payments",authenticate,isAdmin, eventController.getEventPayments);

module.exports = router;
