const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../db/database');
const Class = require('./Class');
const Account = require('./Account');

module.exports = sequelize.define( 
    'Grades',
    {
        gradeID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        classID: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: Class,
                key: 'classID' 
            }
        },
        gradeName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        percentage: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        accountID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Account,
                key: 'accountID'
            }
        },
        grade: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    },
    {
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    }
)