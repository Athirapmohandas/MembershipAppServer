module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT },
        date: { type: DataTypes.DATE, allowNull: false },
        entryFee: { type: DataTypes.INTEGER, allowNull: false },
        location: { type: DataTypes.STRING },
    })

    Event.associate = (models) => {
        Event.hasMany(models.Attendance, { foreignKey: "eventId" })
    }

    return Event
}
