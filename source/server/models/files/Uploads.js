const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../db/database');
const { PageSessions } = require('./PageSessions');

module.exports = sequelize.define(
    'Uploads',
    {
        fileID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        fileName: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        sessionID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        fileInfo: {
            type: DataTypes.BLOB('long'),
            allowNull: false,
        }
    },
    {
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    }
)