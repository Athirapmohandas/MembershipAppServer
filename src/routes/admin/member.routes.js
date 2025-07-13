// /**
//  * @swagger
//  * tags:
//  *   name: Members
//  *   description: API endpoints for managing members
//  */

// /**
//  * @swagger
//  * /api/members:
//  *   get:
//  *     summary: Get all members
//  *     security:
//  *       - bearerAuth: []
//  *     tags: [Admin - Member Management]
//  *     responses:
//  *       200:
//  *         description: List of members
//  */
const express = require("express")
const multer = require("multer");
const fs = require("fs");
const {
    createMember,
    getMembers,
    getMemberById,
    updateMember,
    disableMember,
    getMemberQRCode,
    uploadReceipt
} = require("../../controllers/admin/member.controller")
const { authenticate, isAdmin, isMember } = require("../../middleware/auth")
const router = express.Router()

/**
 * @swagger
 * /api/admin/members:
 *   post:
 *     summary: Create a new member
 *     tags: [Admin - Member Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *               - membershipType
 *               - zone
 *             properties:
 *               name:
 *                 type: string
 *                 example: User
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: user@123
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               membershipType:
 *                 type: string
 *                 example: Gold
 *               zone:
 *                 type: string
 *                 example: Zone A
 *     responses:
 *       201:
 *         description: Member created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/", authenticate, isAdmin, createMember)
/**
 * @swagger
 * /api/admin/members:
 *   get:
 *     summary: Get all members with optional filters
 *     tags: [Admin - Member Management]
 *     parameters:
 *       - in: query
 *         name: zone
 *         schema:
 *           type: string
 *         description: Filter by zone
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status (active, disabled, etc.)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by membership type
 *     responses:
 *       200:
 *         description: List of members
 */

// router.get("/", authenticate, isAdmin, getMembers)
router.get("/", authenticate, isAdmin, getMembers)

/**
 * @swagger
 * /api/admin/members/{id}:
 *   get:
 *     summary: Get a member by ID
 *     tags: [Admin - Member Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Member details
 */
router.get("/:id", authenticate, isAdmin, getMemberById)

/**
 * @swagger
 * /api/admin/members/{id}:
 *   put:
 *     summary: Update a member
 *     tags: [Admin - Member Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - membershipType
 *               - zone
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               membershipType:
 *                 type: string
 *                 example: Gold
 *               zone:
 *                 type: string
 *                 example: Zone A
 *     responses:
 *       200:
 *         description: Member updated
 */

router.put("/:id", authenticate, isAdmin, updateMember)

/**
 * @swagger
 * /api/admin/members/{id}:
 *   delete:
 *     summary: Disable a member
 *     tags: [Admin - Member Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Member disabled
 */
router.delete("/:id", authenticate, isAdmin, disableMember)

/**
 * @swagger
 * /api/admin/members/{id}/qrcode:
 *   get:
 *     summary: Get QR code for a member
 *     tags: [Admin - Member Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: QR code image
 */
router.get("/:id/qrcode", authenticate, isAdmin, getMemberQRCode)


// const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/receipts";
    // ✅ Ensure the directory exists
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});


const upload = multer({ storage });

/**
 * @swagger
 * /api/admin/members/upload-receipt:
 *   post:
 *     summary: Upload a receipt file for a member
 *     tags: [Admin - Member Management]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: integer
 *               eventId:
 *                 type: integer
 *               receipt:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Receipt uploaded successfully
 */
router.post("/upload-receipt",authenticate, isAdmin, upload.single("receipt"), uploadReceipt);
module.exports = router
