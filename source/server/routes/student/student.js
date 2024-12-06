const express = require('express');
const studentController = require('../../controllers/student/student');
const { isAuthenticated, isStudent } = require('../../funct/auth');
const StudentRouter = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

StudentRouter.get('/student/openingCourseView', studentController.openingCourseView);
StudentRouter.post('/student/getRegisteredCourses', studentController.getRegisteredCourses);
StudentRouter.post('/student/enrollCourseReq',studentController.enrollCourseReq);
StudentRouter.post('/student/enrolledCourseView',studentController.enrolledCourseView);
StudentRouter.post('/student/registerCourse',studentController.registerCourse);
StudentRouter.post('/student/dropCourse',studentController.dropCourse);
StudentRouter.post('/student/viewSchedule',studentController.viewSchedule);
StudentRouter.post('/student/viewScore',studentController.viewScore);
StudentRouter.post('/student/viewCourseGrade',studentController.viewCourseGrade);
StudentRouter.post('/student/viewAssignmentFile',studentController.viewAssignmentFiles);
StudentRouter.post('/student/viewSubmit',studentController.viewSubmit);
StudentRouter.post('/student/submitAssignment', upload.single('file'), studentController.submitAssignment);

module.exports = StudentRouter;