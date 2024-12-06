const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../db/database');
const { Class } = require('./Class'); 

module.exports = sequelize.define( 
    'PageSessions',
    {
        sessionID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        classID: {
            type: DataTypes.STRING(10),
            allowNull: false,
            references: {
                model: Class,
                key: 'classID'
            }
        },
        sessionName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        sessionTier: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        parentSession: {
            type: DataTypes.INTEGER,
            allowNull: true,
            key: 'parentSession',
            references: {
                model: 'PageSessions',
                key: 'sessionID'
            }
        },
    },
    {
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    }
);