module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("Admin", {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        role: {
            type: DataTypes.STRING,
            defaultValue: "admin",
        },
    })

    return Admin
}
