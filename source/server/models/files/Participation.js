const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../db/database');
const { Account } = require('./Account');
const { Class } = require('./Class'); 

module.exports = sequelize.define(
    'Participation',
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
            key: 'classID',
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