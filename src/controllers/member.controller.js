// server/src/controllers/member.mobile.controller.js

const { Member, Event, Notification, Payment } = require("../models")
const { Op } = require("sequelize")

const getMemberHome = async (req, res) => {
    try {
        const member = await Member.findByPk(req.user.id)
        if (!member) return res.status(404).json({ error: "Member not found" })

        const nextEvent = await Event.findOne({
            where: { date: { [Op.gt]: new Date() } },
            order: [["date", "ASC"]],
        })

        res.json({
            memberCard: {
                name: member.name,
                id: member.id,
                type: member.membershipType,
                expiryDate: member.expiryDate,
            },
            nextEvent,
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const getRenewalStatus = async (req, res) => {
    try {
        const member = await Member.findByPk(req.user.id)
        if (!member) return res.status(404).json({ error: "Member not found" })
        res.json({
            status: member.status,
            expiryDate: member.expiryDate,
            renewalDue: member.renewalDue,
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const simulatePayment = () => {
    // Always succeed in test
    return {
        success: true,
        transactionId: "TXN" + Date.now(), // mock transaction ID
        amount: 1000,
        method: "mock",
        status: "success",
    }
}

const renewMembership = async (req, res) => {
    try {
        const member = await Member.findByPk(req.user.id)
        if (!member) {
            return res.status(404).json({ error: "Member not found" })
        }

        const today = new Date()
        const expiryDate = new Date(member.expiryDate)
        console.log(expiryDate, today, expiryDate > today)
        if (expiryDate > today) {
            return res.status(400).json({
                error: "Membership is still active. Cannot renew before expiry.",
                expiryDate: member.expiryDate,
            })
        }
        //  Simulate payment
        const payment = simulatePayment()
        if (!payment.success) {
            return res.status(402).json({ error: "Payment failed", payment })
        }
        // Proceed with renewal
        const newExpiry = new Date()
        newExpiry.setFullYear(newExpiry.getFullYear() + 1)

        await member.update({
            expiryDate: newExpiry,
            status: "active",
            renewalDue: "false",
        })
        // Optional: Log the payment (for extra points)
        await Payment.create({
            memberId: member.id,
            amount: payment.amount,
            method: payment.method,
            status: payment.status,
        })
        // SOFT delete after renewal
        await Notification.update(
            { deletedAt: new Date() },
            {
                where: {
                    memberId: req.user.id,
                    title: "Membership Expiry Reminder",
                    deletedAt: null,
                },
                paranoid: false, // to allow update of soft delete manually
            }
        )
        res.json({
            message: "Membership renewed successfully",
            expiryDate: newExpiry,
            payment,
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// EVENT notification showing only for the upcoming events
const getNotifications = async (req, res) => {
    try {
  const memberId = req.user.id;
  const today = new Date();

  console.log("today", today);

  // Get all relevant notifications:
  const notifications = await Notification.findAll({
    where: {
      [Op.or]: [
        { memberId }, // Member-specific
        { memberId: null }, // Global
      ],
    },
    include: [
      {
        model: Event,
        required: false, // Include even if event is null
        where: {
          [Op.or]: [
            { date: { [Op.gte]: today } }, // Upcoming events
            { date: null }, // Allow non-event notifications
          ],
        },
      },
    ],
  });

  res.json(notifications);
}  catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const sendNotification = async (req, res) => {
    try {
        const { title, message } = req.body
        const notification = await Notification.create({
            title,
            message,
        })
        res.status(201).json(notification)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    getMemberHome,
    getRenewalStatus,
    renewMembership,
    getNotifications,
    sendNotification,
}
