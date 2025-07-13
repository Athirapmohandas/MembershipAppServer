const jwt = require("jsonwebtoken")
require("dotenv").config()

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ message: "No token provided" })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        res.status(401).json({ message: "Invalid token" })
    }
}

const isAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." })
    }
    next()
}

const isMember = (req, res, next) => {
    if (req.user?.role !== "member") {
        return res.status(403).json({ message: "Access denied. Members only." })
    }
    next()
}

module.exports = { authenticate, isAdmin, isMember }
