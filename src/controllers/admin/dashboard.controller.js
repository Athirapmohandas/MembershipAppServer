// server/src/controllers/dashboard.controller.js

const { Member, Payment, sequelize } = require("../../models")
const { Op } = require("sequelize")

const getTotalMembers = async (req, res) => {
    try {
        const count = await Member.count()
        const members = await Member.findAll({
            attributes: [
                "id",
                "name",
                "email",
                "phone",
                "membershipType",
                "status",
                "zone",
            ],
        })
        res.json({ totalMembers: count, members: members })
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch total members" })
    }
}

const getActiveMembers = async (req, res) => {
    try {
        const count = await Member.count({ where: { status: "active" } })
        const members = await Member.findAll({
            where: { status: "active" },
            attributes: [
                "id",
                "name",
                "email",
                "phone",
                "membershipType",
                "zone",
            ],
        })
        res.json({ activeMembers: count, members: members })
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch active members" })
    }
}

const getPendingRenewals = async (req, res) => {
    try {
        const today = new Date()
        const count = await Member.count({
            where: {
                renewalDue: { [Op.eq]: true },
                status: { [Op.ne]: "inactive" },
            },
        })
        const members = await Member.findAll({
            where: {
                renewalDue: { [Op.eq]: true },
                status: { [Op.ne]: "inactive" },
            },
            attributes: [
                "id",
                "name",
                "email",
                "phone",
                "membershipType",
                "zone",
            ],
        })
        res.json({ pendingRenewals: count, members: members })
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch pending renewals" })
    }
}

const getRecentPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            limit: 5,
            order: [["createdAt", "DESC"]],
        })
        res.json({ recentPayments: payments })
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch recent payments" })
    }
}

const getMembershipDistribution = async (req, res) => {
    try {
        const byType = await Member.findAll({
            attributes: [
                "membershipType",
                [
                    sequelize.fn("COUNT", sequelize.col("membershipType")),
                    "count",
                ],
            ],
            group: ["membershipType"],
        })

        const byMonth = await Payment.findAll({
            attributes: [
                [
                    sequelize.fn(
                        "DATE_TRUNC",
                        "month",
                        sequelize.col("createdAt")
                    ),
                    "month",
                ],
                [sequelize.fn("COUNT", sequelize.col("id")), "count"],
            ],
            group: [
                sequelize.fn("DATE_TRUNC", "month", sequelize.col("createdAt")),
            ],
            order: [
                [
                    sequelize.fn(
                        "DATE_TRUNC",
                        "month",
                        sequelize.col("createdAt")
                    ),
                    "DESC",
                ],
            ],
        })

        res.json({
            distributionByType: byType,
            distributionByMonth: byMonth,
        })
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch distribution data" })
    }
}


module.exports = {
    getTotalMembers,
    getActiveMembers,
    getPendingRenewals,
    getRecentPayments,
    getMembershipDistribution,
}
