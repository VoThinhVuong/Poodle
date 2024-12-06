const Account = require('./files/Account');
const AccountInfo = require('./files/AccountInfo');
const Class = require('./files/Class');
const Course = require('./files/Course');
const Open_registration = require('./files/Open_Regist');
const Participation = require('./files/Participation');
const Scores = require('./files/Scores');
const Teachings = require('./files/Teaching');
const Uploads = require('./files/Uploads')
const PageSessions = require('./files/PageSessions');
const Assignments = require('./files/Assignment');
const Submits = require('./files/Submit');
const Grades = require('./files/Grade');
const Announcements = require('./files/Annoucement');

Account.hasOne(AccountInfo, {foreignKey: 'accountID'});
AccountInfo.belongsTo(Account, {foreignKey: 'accountID'});

Course.hasMany(Class, {foreignKey: 'courseID'});
Class.belongsTo(Course, {foreignKey: 'courseID'});

Course.hasMany(Open_registration, {foreignKey: 'courseID'});
Open_registration.belongsTo(Course, {foreignKey: 'courseID'});

Account.hasMany(Participation, {foreignKey: 'accountID'});
Participation.belongsTo(Account, {foreignKey: 'accountID'});

Class.hasMany(Participation, {foreignKey: 'classID'});
Participation.belongsTo(Class, {foreignKey: 'classID'});

Account.hasMany(Scores, {foreignKey: 'accountID'});
Scores.belongsTo(Account, {foreignKey: 'accountID'});

Course.hasMany(Scores, {foreignKey: 'courseID'});
Scores.belongsTo(Course, {foreignKey: 'courseID'});

Account.hasMany(Teachings, {foreignKey: 'accountID'});
Teachings.belongsTo(Account, {foreignKey: 'accountID'});

Class.hasMany(Teachings, {foreignKey: 'classID'});
Teachings.belongsTo(Class, {foreignKey: 'classID'});


Class.hasMany(PageSessions, {foreignKey: 'classID'});
PageSessions.belongsTo(Class, {foreignKey: 'classID'});
PageSessions.hasMany(PageSessions, {foreignKey: 'parentSession'});
PageSessions.belongsTo(PageSessions, {foreignKey: 'parentSession'});

PageSessions.hasMany(Uploads, {foreignKey: 'sessionID'});
Uploads.belongsTo(PageSessions, {foreignKey: 'sessionID'});

Class.hasMany(Assignments, {foreignKey: 'classID'});
Assignments.belongsTo(Class, {foreignKey: 'classID'});

Assignments.hasMany(Submits, {foreignKey: 'assignmentID'});
Submits.belongsTo(Assignments, {foreignKey: 'assignmentID'});

Account.hasMany(Submits, {foreignKey: 'accountID'});
Submits.belongsTo(Account, {foreignKey: 'accountID'});

Uploads.hasOne(Submits, {foreignKey: 'fileID'});
Submits.belongsTo(Uploads, {foreignKey: 'fileID'});

Account.hasMany(Grades, {foreignKey: 'accountID'});
Grades.belongsTo(Account, {foreignKey: 'accountID'});

Class.hasMany(Grades, {foreignKey: 'classID'});
Grades.belongsTo(Class, {foreignKey: 'classID'});

Class.hasMany(Announcements, {foreignKey: 'classID'});
Announcements.belongsTo(Class, {foreignKey: 'classID'});
Account.hasMany(Announcements, {foreignKey: 'accountID'});
Announcements.belongsTo(Account, {foreignKey: 'accountID'});

module.exports = {Account, AccountInfo, Class, Course, Open_registration, Participation, Scores, Teachings, PageSessions, Uploads, Assignments, Submits, Grades, Announcements};