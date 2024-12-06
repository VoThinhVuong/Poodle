const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../db/database');
const Uploads = require('./Uploads');
const Class = require('./Class');

module.exports = sequelize.define( 
    'Assignments',
    {
        assignmentID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        classID: {
            type: DataTypes.STRING(10),
            allowNull: false,
            key: 'classID',
            references: {
                model: Class,
                key: 'classID'
            }
        },
        assignmentTitle: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        assignmentDescription: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        assignmentStartDate: {
            type: DataTypes.DATE,
            allowNull: false
        }, 
        assignmentEndDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        assignmentFile: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            key: 'fileID',
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