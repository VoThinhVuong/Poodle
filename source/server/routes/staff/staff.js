const express = require('express');
const StaffController = require('../../controllers/staff/staff');
const {isAuthenticated, isStaff} = require('../../funct/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const StaffRouter = express.Router();

StaffRouter.post('/staff/TeachingCourseView', StaffController.TeachingCourseView);
StaffRouter.post('/staff/addSession', StaffController.addSession);
StaffRouter.post('/staff/viewSessions', StaffController.viewSessions);
StaffRouter.post('/staff/removeAllSessions', StaffController.removeAllSessions);
StaffRouter.post('/staff/removeSession', StaffController.removeSession);
StaffRouter.post('/staff/viewChildrenSessions', StaffController.viewChildrenSessions);
StaffRouter.post('/staff/uploadFile', upload.single('file'), StaffController.uploadFile);
StaffRouter.post('/staff/viewFiles', StaffController.viewFiles);
StaffRouter.post('/staff/removeFile', StaffController.removeFile);
StaffRouter.post('/staff/downloadFile', StaffController.downloadFile);
StaffRouter.post('/staff/addAssignment',upload.single('file'), StaffController.addAssignment);
StaffRouter.post('/staff/viewAssignments', StaffController.viewAssignments);
StaffRouter.post('/staff/removeAssignment', StaffController.removeAssignment);
StaffRouter.post('/staff/viewSubmits', StaffController.viewSubmits);
StaffRouter.post('/staff/getFileFromAssignment', StaffController.getFileFromAssignment);
StaffRouter.post('/staff/editAssignment', upload.single('file') ,StaffController.editAssignment);

StaffRouter.post('/staff/viewGrades', StaffController.viewGrades);
StaffRouter.post('/staff/addGrade', StaffController.addGrade);
StaffRouter.post('/staff/updateGrade', StaffController.updateGrade);

StaffRouter.post('/staff/viewAnnouncements', StaffController.viewAnnouncements);
StaffRouter.post('/staff/addAnnouncement', StaffController.addAnnouncement);
StaffRouter.post('/staff/removeAnnouncement', StaffController.removeAnnouncement);
StaffRouter.post('/staff/editAnnouncement', StaffController.editAnnouncement);

module.exports = StaffRouter;