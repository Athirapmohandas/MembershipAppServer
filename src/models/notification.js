module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notification", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        memberId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    })

    Notification.associate = (models) => {
        Notification.belongsTo(models.Member, {
            foreignKey: "memberId",
            onDelete: "CASCADE",
        })
        Notification.belongsTo(models.Event, {
            foreignKey: "eventId",
            onDelete: "CASCADE",
        })
    }

    return Notification
}
