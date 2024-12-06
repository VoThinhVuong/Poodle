const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../db/database');
const Account = require('./Account');
module.exports = sequelize.define(
    'AccountInfo',
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
        fullname: {
            type: DataTypes.STRING(30),
            allowNull: false
        }
    },
    {
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    }
)