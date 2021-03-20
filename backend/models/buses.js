module.exports = (sequelize, Sequelize) => {
    return sequelize.define("buses", {
        bus_id: {
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        bus_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        seats: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
}