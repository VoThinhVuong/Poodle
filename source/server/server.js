const AppPort = 9000;
// //npm run server

const express = require('express');
//const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./db/database.js');
const app = express();
const Model = require('./models/Models');

const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(session({
//   secret: 'eldoop-ppa',
//   resave: false,            
//   saveUninitialized: true,
//   cookie: {
//     maxAge: 1800000
//   }
// }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const generalRoutes = require('./routes/general.js');
const dbManagerRoutes = require('./routes/db-manager/db-manager.js');
const staffRoutes = require('./routes/staff/staff.js');
const studentRoutes = require('./routes/student/student.js');

app.use('/', generalRoutes);
app.use('/', dbManagerRoutes);
app.use('/', staffRoutes);
app.use('/', studentRoutes);

async function startServer() {
  try {
    // Sync the Sequelize models with the database
    await sequelize.sync({ force: false });

    // Execute the DESCRIBE query to check all columns of the table
    // const dropTable2 = await sequelize.query(`DROP TABLE IF EXISTS Submits`);
    // const dropTable1 = await sequelize.query(`DROP TABLE IF EXISTS Grades`);

    //  const dropTable = await sequelize.query(`DROP TABLE IF EXISTS Uploads`);
      
    //   const dropTable2 = await sequelize.query(`DROP TABLE IF EXISTS ${tableName1}`);

    // Display the column details
    // console.log('Columns of the table:', rows);

    // Start the server
    app.listen(AppPort, () => {
      console.log('Port opened at: ' + AppPort);
      const href = 'http://localhost:' + AppPort;
      console.log('Server running at ' + href);
    });

  } catch (error) {
    console.error('Error starting the server:', error.message);
  }
}

// Call the function to start the server
startServer();


