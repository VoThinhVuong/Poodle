const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('stumang', 'root', 'admin', {
    dialect:'mysql',
    host : 'localhost',
});


module.exports = sequelize;


