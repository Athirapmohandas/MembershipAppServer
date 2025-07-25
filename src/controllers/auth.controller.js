const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { Member, Admin } = require("../models")
const { Op } = require("sequelize")

// REGISTER
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body

        //  Validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }
        if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
            return res.status(400).json({ error: "Invalid email format" })
        }

        // Check if admin exists
        const existing = await Admin.findOne({ where: { email } })
        if (existing) {
            return res.status(400).json({ error: "Admin already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
        })

        res.status(201).json({ message: "Admin registered successfully" })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// MEMBER LOGIN
const loginMember = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await Member.findOne({ where: { email } })

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        if (user.status === "disabled") {
            return res.status(403).json({
                message: "Your account is disabled. Please contact support.",
            })
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )
        res.json({ token })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ADMIN LOGIN
const loginAdmin = async (req, res) => {
    try {
        const { email, password, role } = req.body
        const user = await Admin.findOne({ where: { email } })
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )
        res.json({ token })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    registerAdmin,
    loginMember,
    loginAdmin,
}
