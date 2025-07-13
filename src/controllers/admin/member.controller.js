const { Member, Payment } = require("../../models")
const bcrypt = require("bcryptjs")
const QRCode = require("qrcode")
const { Op } = require("sequelize")

const createMember = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            membershipType,
            zone,
        } = req.body

        const emailExist = await Member.findOne({ where: { email } })
        if (emailExist) {
            return res.status(400).json({ error: "Email already exists" })
        }
        //  Validation
        if (
            !name ||
            !email ||
            !password ||
            !phone ||
            !membershipType ||
            !zone
        ) {
            return res.status(400).json({ error: "All fields are required" })
        }
        if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
            return res.status(400).json({ error: "Invalid email format" })
        }
        if (!/^[0-9]{10}$/.test(phone)) {
            return res.status(400).json({ error: "Phone must be 10 digits" })
        }
        const hashedPassword = await bcrypt.hash(password, 10) // ✅ Hash it here
        const expiryDate = new Date()
        expiryDate.setMonth(expiryDate.getMonth() + 6) // add 6 months from now

        const member = await Member.create({
            name,
            email,
            password: hashedPassword,
            phone,
            membershipType,
            zone,
            expiryDate,
            status: "active",
            renewalDue: false,
        })
        // Hide password in response
        const { password: _, ...result } = member.toJSON()
        res.status(201).json(result)
    } catch (error) {
        console.error("Error creating member:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

const getMembers = async (req, res) => {
    try {
        const { zone, status, type } = req.query
        const filters = {}
        if (zone) filters.zone = zone
        if (status) filters.status = status
        if (type) filters.membershipType = type

        const members = await Member.findAll({ where: filters ,attributes: { exclude: ['password']} },
        )
        res.status(200).json(members)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const getMemberById = async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id)
        if (!member) return res.status(404).json({ error: "Member not found" })
        res.status(200).json(member)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const updateMember = async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id)
        if (!member) return res.status(404).json({ error: "Member not found" })

        await member.update(req.body)
        res.status(200).json({ message: "Upated member details" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const disableMember = async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id)
        if (!member) return res.status(404).json({ error: "Member not found" })

        await member.update({ status: "disabled" })
        res.status(200).json({ message: "Member disabled" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getMemberQRCode = async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id)
        if (!member) return res.status(404).json({ error: "Member not found" })

        const qrData = JSON.stringify({ id: member.id, name: member.name, email:member.email, phone:member.phone, "membership type":member.membershipType, zone:member.zone })
        const qrCode = await QRCode.toDataURL(qrData)

        res.status(200).json({ qrCode })
    } catch (error) {
        console.error("QR generation failed:", error)
        res.status(500).json({ error: "Failed to generate QR code" })
    }
}

const uploadReceipt = async (req, res) => {
    try {
        const { memberId, eventId } = req.body
        const filePath = req.file ? req.file.path : null

        if (!filePath) {
            return res.status(400).json({ error: "Receipt file is required" })
        }

        const member = await Member.findByPk(memberId)
        if (!member) {
            return res.status(404).json({ error: "Member not found" })
        }

        const baseUrl = `${req.protocol}://${req.get("host")}`
        const fullUrl = `${baseUrl}/${filePath.replace(/\\/g, "/")}` // Fix Windows \ path
        // Build dynamic query condition
        const whereCondition = {
            memberId: memberId,
            receiptUrl: null,
        }
        if (eventId !== undefined && eventId !== null) {
            whereCondition.eventId = eventId
        }

        const payment = await Payment.findOne({ where: whereCondition })

        if (!payment) {
            return res
                .status(404)
                .json({ error: "Matching payment record not found" })
        }

        // Update receipt URL
        await payment.update({ receiptUrl: fullUrl })
        res.status(200).json({
            message: "Receipt uploaded successfully",
            path: fullUrl,
        })
    } catch (error) {
        console.error("Upload error:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
module.exports = {
    createMember,
    getMembers,
    getMemberById,
    updateMember,
    disableMember,
    getMemberQRCode,
    uploadReceipt,
}