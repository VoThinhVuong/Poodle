const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../db/database');
const { Account } = require('./Account');
const { Course } =require('./Course');

module.exports = sequelize.define(
    'Scores',
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
        courseID: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true,
            key: 'courseID',
            references: {
                model: Course,
                key: 'courseID'
            }
        },
        scores: {
            type: DataTypes.DECIMAL(5,2)
        }
    },
    {
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    }
)