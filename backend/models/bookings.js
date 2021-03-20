module.exports = (sequelize, Sequelize) => {
    return sequelize.define("bookings", {
        booking_id: {
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        source: {
            type: Sequelize.STRING,
            allowNull: false
        },
        destination: {
            type: Sequelize.STRING,
            allowNull: false
        },
        seats: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        booking_date: {
            type: Sequelize.STRING,
            allowNull: false
        },
        booking_time: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
}