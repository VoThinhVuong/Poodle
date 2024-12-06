const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../db/database');
const Class = require('./Class');
const Account = require('./Account');

module.exports = sequelize.define( 
    'Announcements', {
        announcementID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        classID: {
            type: DataTypes.STRING(10),
            key: 'classID',
            references: {
                model: Class,
                key: 'classID'
            }
        },
        title: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        content: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        accountID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            key: 'accountID',
            references: {
                model: Account,
                key: 'accountID'
            }
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    }
)