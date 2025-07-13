
module.exports = (sequelize, DataTypes) => {
    const Member = sequelize.define("Member", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, unique: true },
        phone: { type: DataTypes.STRING },
        membershipType: { type: DataTypes.STRING },
        status: { type: DataTypes.STRING, defaultValue: "active" }, // active, inactive, etc.
        zone: { type: DataTypes.STRING },
        expiryDate: { type: DataTypes.DATE },
        renewalDue: { type: DataTypes.BOOLEAN, defaultValue: false },
        password: { type: DataTypes.STRING },
        role: {
            type: DataTypes.STRING,
            defaultValue: "member",
        },
        // role: { type: DataTypes.ENUM("admin", "member"), defaultValue: "member" },
    })

    Member.associate = (models) => {
        Member.hasMany(models.Payment, { foreignKey: "memberId" })
        Member.hasMany(models.Attendance, { foreignKey: "memberId" })
    }

    return Member
}
