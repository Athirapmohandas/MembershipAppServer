// membership-backend/src/models/Payment.js

module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define("Payment", {
        memberId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        mode: {
            type: DataTypes.STRING, // e.g., "cash", "online"
        },
        receiptUrl: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING, // e.g., "success", "pending"
            defaultValue: "success",
        },
        paidAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    })

    Payment.associate = (models) => {
        Payment.belongsTo(models.Member, { foreignKey: "memberId" })
    }

    return Payment
}
