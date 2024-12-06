const express = require('express');
const DbManagerController = require('../../controllers/db-manager/db-manager');
const {isAuthenticated, isDatabaseManager} = require('../../funct/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const DbManagerRouter = express.Router();
DbManagerRouter.get('/infoDBM', isAuthenticated, isDatabaseManager, DbManagerController.infoView);
DbManagerRouter.get('/dbmanager/viewExistStudents', DbManagerController.viewExistStudents);
DbManagerRouter.get('/dbmanager/viewExistStaffs', DbManagerController.viewExistStaffs);
DbManagerRouter.get('/dbmanager/viewExistCourses', DbManagerController.viewExistCourses);
DbManagerRouter.get('/dbmanager/viewExistClasses', DbManagerController.viewExistClasses);
DbManagerRouter.post('/dbmanager/add-student-staff', upload.single('file'), DbManagerController.addStudentStaff);
DbManagerRouter.post('/dbmanager/addCourse', DbManagerController.addCourse);
DbManagerRouter.post('/dbmanager/addClass', DbManagerController.addClass);
DbManagerRouter.post('/dbmanager/editCourse', DbManagerController.editCourse);
DbManagerRouter.post('/dbmanager/editClass', DbManagerController.editClass);
DbManagerRouter.post('/dbmanager/editStudentStaff', DbManagerController.editStudentStaff);
DbManagerRouter.post('/dbmanager/deleteCourse', DbManagerController.deleteCourse);
DbManagerRouter.post('/dbmanager/deleteClass', DbManagerController.deleteClass);
DbManagerRouter.post('/dbmanager/deleteStudentStaff', DbManagerController.deleteStudentStaff);

DbManagerRouter.post('/dbmanager/getLecturer', DbManagerController.getLecturer);
module.exports = DbManagerRouter;

