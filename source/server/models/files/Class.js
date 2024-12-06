const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../db/database');

const { Course } = require('./Course'); 
module.exports = sequelize.define(
    'Class',
    {
        classID: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true,
        },
        courseID: {
            type: DataTypes.STRING(10),
            key: 'courseID',
            references: {
                model: Course,
                key: 'courseID'
            }
        },
        enrolledNum: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        maxSlot: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        weekday: {
            type: DataTypes.TINYINT,
            allowNull: false
        },
        timeStart: {
            type: DataTypes.TIME,
            allowNull: false
        },
        timeEnd: {
            type: DataTypes.TIME,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        semester: {
            type: DataTypes.TINYINT,
            allowNull: false
        },
        dateStart: {
            type: DataTypes.DATE
        },
        dateEnd: {
            type: DataTypes.DATE
        }
    },
    {
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    }
)