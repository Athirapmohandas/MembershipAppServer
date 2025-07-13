module.exports = (sequelize, DataTypes) => {
    const Attendance = sequelize.define("Attendance", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        eventId: { type: DataTypes.INTEGER, allowNull: false },
        memberId: { type: DataTypes.INTEGER, allowNull: false },
        attended: { type: DataTypes.BOOLEAN, defaultValue: false },
    })

    Attendance.associate = (models) => {
        Attendance.belongsTo(models.Event, { foreignKey: "eventId" })
        Attendance.belongsTo(models.Member, { foreignKey: "memberId" })
    }

    return Attendance
}
