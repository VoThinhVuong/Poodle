const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../db/database');
module.exports = sequelize.define(
    'Account',
    {
        accountID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    }
)