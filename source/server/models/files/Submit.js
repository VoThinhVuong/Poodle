const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../db/database');
const Assignments = require('./Assignment');
const Uploads = require('./Uploads');

module.exports = sequelize.define( 
    'Submits',
    {
        submitID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        assignmentID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            key: 'assignmentID',
            references: {
                model: 'Assignments',
                key: 'assignmentID'
            }
        },
        accountID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            key: 'accountID',
            references: {
                model: 'Accounts',
                key: 'accountID'
            }
        },
        submitDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        submitFile: {
            type: DataTypes.INTEGER,
            allowNull: false,
            key: 'submitFile',
            references: {
                model: Uploads,
                key: 'fileID'
            }
        }
    },
    {
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    }
)