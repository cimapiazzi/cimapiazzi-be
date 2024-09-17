module.exports = (sequelize, Sequelize) => {
    const UserRoles = sequelize.define("user_roles", {
        userId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        roleId: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return UserRoles;
};
