const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../db/database');
const Class = require('./Class');
const Account = require('./Account');
module.exports = sequelize.define(
    'Teachings',
    {
        accountID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: Account,
                key: 'accountID'
            }
        },
        classID: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true,
            references: {
                model: Class,
                key: 'classID'
            }
        }
    },
    {
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    }
)