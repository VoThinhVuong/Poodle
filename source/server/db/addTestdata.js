const fs = require('fs');
const sql = require('mysql2');

const connection = sql.createConnection({
    host: '127.0.0.2',
    user: 'root',
    password: '0838132919',
    database: 'stumang'
});

fs.readFile('../server/database/db.sql', 'utf8', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        connection.query(data, (error, results) => {
            if (error) {
              console.error('Error executing SQL script:', error);
              return;
            }
        
            console.log('SQL script executed successfully:', results);
          });
        
    }
});

fs.readFile('server/db/sqlTestcase.sql', 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return
    }
    connection.query(data, (error, results) => {
        if (error) {
            console.error('Error executing SQL script:', error);
            return;
        }

        console.log('SQL script executed successfully:', results);
    });
    connection.end();
});