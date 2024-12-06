const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../db/database');
const { Course } = require('./Course');

module.exports = sequelize.define(
    'Open_registration',
    {
        courseID: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true,
            references: {
                model: Course,
                key: 'courseID'
            }
        },
        dateOpen: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        dateClose: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    }
)