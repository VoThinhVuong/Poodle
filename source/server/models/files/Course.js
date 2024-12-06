const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../db/database');
module.exports = sequelize.define(
    'Course',
    {
        courseID: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true
        },
        courseName: {
            type: DataTypes.STRING(30),
        },
        credit: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    },
    {
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    }
)