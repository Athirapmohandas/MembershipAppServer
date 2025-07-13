const express = require("express");
const { loginMember, loginAdmin, registerAdmin } = require("../controllers/auth.controller");
// const { authenticate,  } = require("../middleware/auth");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/auth/member/login:
 *   post:
 *     summary: Member login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: user@example.com
 *             password: user@123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/member/login", loginMember);



// /**
//  * @swagger
//  * tags:
//  *   name: Admin
//  *   description: Admin authentication and operations
//  */

/**
 * @swagger
 * /api/auth/admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Admin User
 *             email: admin@example.com
 *             password: admin@123
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Admin already exists
 *       500:
 *         description: Server error
 */
router.post('/admin/register', registerAdmin);

/**
 * @swagger
 * /api/auth/admin/login:
 *   post:
 *     summary: Login as admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: admin@example.com
 *             password: admin@123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             example:
 *               message: Login successful
 *               token: eyJhbGciOiJIUzI1NiIsInR...
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */
router.post('/admin/login', loginAdmin);

module.exports = router;