const { where, Op } = require('sequelize');
const Model = require('../../models/Models');
const fs = require('fs');
const { add } = require('date-fns');
const { get } = require('http');

module.exports = {
    TeachingCourseView: async (req, res) => {
        const { ID } = req.body;
        const today = new Date();  // Use `new Date()` to get the current date
        try {
            const TeachingClasses = await Model.Teachings.findAll({
                where: {
                    accountID: ID
                },
                include: [{
                    model: Model.Class,
                    required: true,
                    // where: {
                    //     dateStart: { [Op.lte]: today },
                    //     dateEnd: { [Op.gte]: today }
                    // },
                    include: [{
                        model: Model.Course,
                        required: true
                    }]
                }]
            });
            
            if (TeachingClasses) {
                console.log("TeachingClasses",TeachingClasses);
                res.json(TeachingClasses);
            } else {
                res.json({ error: "Unable to fetch classes" });
            }
        } catch (error) {
            console.error("Error fetching teaching classes:", error);
            res.json({ error: "An error occurred while fetching classes" });
        }
    },

    courseView: async (req, res) => {
        course = await Model.Course.findOne({where: {courseID: req.session.courseID}});
        if (course) {
            const data = {
                course: {
                    // this is just course information
                    courseID: course.courseID,
                    courseName: course.courseName,
                    credit: course.credit,
                    // courseDescription: course.courseDescription,
                    // courseStartDate: course.courseStartDate,
                    // courseEndDate: course.courseEndDate
                    // Add more fields here
                    // ex: files: course.files, folder: course.folder
                    // anouncements: course.announcements
                    // etc.
                }
            };
            res.json(data);
        }
    },

    modifyClassView: async (req, res) => {
        classes = await getModifiableCourses(req.session.accountID);
        if (classes) {
            const data = {
                classes: classes
            };
            res.json(data);
        }
    },
 
    classScoreView: async (req, res) => {
        const { classID } = req.body;

        const scoreboard = await Model.Participation.findAll({
            //attributes: ['accountID'],
            where: {classID : classID},
            include: [
                {
                    model: Model.AccountInfo,
                    //attributes: ['fullname']
                },
                {
                    model: Model.Scores,
                    //attributes: ['scores']
                }
            ]
        });

        if (scoreboard)
        {
            res.json(scoreboard);
        }
    },

    courseScoreView: async (req, res) => {
        const { courseID } = req.body;

        const scoreboard = await Model.Class.findAll({
            where: {courseID: courseID},
            include: [
                {
                    model: Model.Participation
                },
                {
                    model: Model.AccountInfo
                },
                {
                    model: Model.Scores
                }
            ]
        });

        if (scoreboard) {
            res.json(scoreboard);
        }
    },

    addSession: async (req, res) => { 
        const { classID, sessionName, sessionTier, parentSession } = req.body;
        console.log("addSession",req.body);
        const existingSession = await Model.PageSessions.findOne({  where: { classID: classID, sessionName: sessionName } });
        if (existingSession) {
            res.json({ error: 'Session already exists' });
            return;
        }
        try {
            const newSession = await Model.PageSessions.create({
                classID: classID,
                sessionName: sessionName,
                sessionTier: sessionTier,
                parentSession: parentSession
            });
            if (newSession) {
                res.json({ status: 'success' });
            } else {
                res.json({ error: 'Failed to create session' });
            }
        } catch (error) {
            console.error('Error creating session:', error);
            res.json({ error: 'An error occurred while creating session' });
        }
    },

    removeSession: async (req, res) => { 
        const { sessionID } = req.body;
        try {
            const session = await Model.PageSessions.destroy({ where: { sessionID: sessionID } });
            if (session) {
                const files = await Model.Uploads.destroy({ where: { sessionID: sessionID } });
                res.json({ status: 'success' });
            } else {
                res.json({ error: 'Failed to remove session' });
            }
        }catch {
            console.error('Error removing session:', error);
            res.json({ error: 'An error occurred while removing session' });
        }

    },

    viewSessions: async (req, res) => { 
        const { classID } = req.body;
        const sessions = await Model.PageSessions.findAll({ where: { classID: classID, sessionTier: 1 } });
        if (sessions) {
            res.json(sessions);
        } else {
            res.json({ error: 'Failed to fetch sessions' });
        }
    },

    removeAllSessions: async (req, res) => { 
        const { classID } = req.body;
        const sessions = await Model.PageSessions.destroy({ where: { classID: classID } });
        if (sessions) {
            res.json({ status: 'success' });
        } else {
            res.json({ error: 'Failed to remove sessions' });
        }
    },

    viewChildrenSessions: async (req, res) => { 
        const { sessionID } = req.body;
        const childSessions = await Model.PageSessions.findAll({ where: { parentSession: sessionID } });
        if (childSessions) {
            res.json(childSessions);
        } else {
            res.json({ error: 'Failed to fetch child sessions' });
        }
    },

    uploadFile: async (req, res) => { 
        const sessionID = req.body.sessionID;
        const file = req.file;
        console.log("uploadFile",sessionID);
        console.log("uploadFile",file);

        if (!file) { 
            res.json({ error: 'No file uploaded' });
            return;
        }

        const existingFile = await Model.Uploads.findOne({ where: { sessionID: sessionID, fileName: file.originalname } });
        if (existingFile) {
            res.json({ error: 'File already exists' });
            return;
        }

        const buffer =  fs.readFileSync(file.path);

        if (file) {
            try {
                const newFile = await Model.Uploads.create({
                    sessionID: sessionID,
                    fileName: file.originalname,
                    fileInfo: buffer
                });
                if (newFile) {
                    res.json({ status: 'success' });
                } else {
                    res.json({ error: 'Failed to upload file' });
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                res.json({ error: 'An error occurred while uploading file' });
            }
        }
    },

    viewFiles: async (req, res) => { 
        const { sessionID } = req.body;
        const files = await Model.Uploads.findAll({where: {sessionID: sessionID}});
        let data = []
        for (let i = 0; i < files.length; i++) {
            const inAssigment = await Model.Assignments.findOne({where: {assignmentFile: files[i].fileID}});
            if (!inAssigment) {
                data.push(files[i]);
            }
        }
        if (files) {
            res.json(data);
        } else {
            res.json({ error: 'Failed to fetch files' });
        }
    },

    downloadFile: async (req, res) => {
        const { fileID } = req.body;

        try {
            // Find the file in the database
            const file = await Model.Uploads.findOne({ where: { fileID: fileID } });

            if (file) {
                // Set the response headers
                res.setHeader('Content-Type', 'application/octet-stream'); // Adjust content type as needed
                res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`); // Set the filename for download

                // Send the file buffer
                res.send(file.fileInfo);
            } else {
                res.status(404).json({ error: 'File not found' });
            }
        } catch (error) {
            console.error('Error fetching file:', error);
            res.status(500).json({ error: 'Failed to fetch file' });
        }
    },

    removeFile: async (req, res) => { 
        const { fileID } = req.body;
        const file = await Model.Uploads.destroy({ where: { fileID: fileID } });
        if (file) {
            res.json({ status: 'success' });
        } else {
            res.json({ error: 'Failed to remove file' });
        }
    },

    addAssignment: async (req, res) => { 
        const classID = req.body.classID;
        const assignmentTitle = req.body.assignmentTitle;
        const assignmentDescription = req.body.assignmentDescription;
        const dueDate = req.body.dueDate;
        const file = req.file;
        console.log("File",file);
        console.log('discription',assignmentDescription);
        console.log('dueDate',dueDate);
        console.log('classID',classID);
        console.log('assignmentTitle',assignmentTitle);

        // if (!file) {
        //     res.json({ error: 'No file uploaded' });
        //     return;
        // }

        const exist = await Model.Assignments.findOne({ where: { classID: classID, assignmentTitle: assignmentTitle } });
        if (exist) {
            res.json({ error: 'Assignment already exists' });
            return;
        }


        if (file) {
            try {
                const buffer = fs.readFileSync(file.path);
                const newUpload = await Model.Uploads.create({ 
                    fileName: file.originalname,
                    fileInfo: buffer
                });
                console.log('newUpload',newUpload);
                if (newUpload) {
                    try {
                        const newAssignment = await Model.Assignments.create({
                            classID: classID,
                            assignmentTitle: assignmentTitle,
                            assignmentDescription: assignmentDescription,
                            assignmentStartDate: new Date(),
                            assignmentEndDate: dueDate,
                            assignmentFile: newUpload.fileID
                        });
                        if (newAssignment) {
                            res.json({ status: 'success' });
                        } else {
                            Model.Uploads.destroy({ where: { fileID: newUpload.fileID } });
                            res.json({ error: 'Failed to create assignment' });
                        }
                    } catch (error) {
                        console.error('Error creating assignment:', error);
                        res.json({ error: 'An error occurred while creating assignment' });
                    }
                } else { 
                    res.json({ error: 'Failed to upload file' });
                }
            } catch (error) {
                console.error('Error creating assignment:', error);
                res.json({ error: 'An error occurred while creating assignment' });
            }
        } else {
            try {
                const newAssignment = await Model.Assignments.create({ 
                    classID: classID,
                    assignmentTitle: assignmentTitle,
                    assignmentDescription: assignmentDescription,
                    assignmentStartDate: new Date(),
                    assignmentEndDate: dueDate
                });
                if (newAssignment) { 
                    res.json({ status: 'success' });
                }
                else { 
                    res.json({ error: 'Failed to create assignment' });
                }
            } catch (error) {
                console.error('Error creating assignment:', error);
                res.json({ error: 'An error occurred while creating assignment' });
            }
        }
    },

    viewAssignments: async (req, res) => { 
        const {classID} = req.body;
        const assignments = await Model.Assignments.findAll({ where: { classID: classID } });
        if (assignments) {
            res.json(assignments);
        } else {
            res.json({ error: 'Failed to fetch assignments' });
        }
    },

    removeAssignment: async (req, res) => { 
        const { assignmentID } = req.body;
        const assignment = await Model.Assignments.findOne({ where: { assignmentID: assignmentID } });
        if (assignment) {
            removed = await Model.Assignments.destroy({where: {assignmentID: assignmentID}})
            if (!removed)
            {
                res.json({ error: 'Failed to remove assignment' });
                return;
            }
            if (assignment.assignmentFile) { 
                file = await Model.Uploads.destroy({ where: { fileID: assignment.assignmentFile } });
                if (!file) {
                    res.json({ error: 'Failed to remove file' });
                    return;
                }
            }
            const submission = await Model.Submits.findOne({where: {assignmentID: assignmentID}})
            if (submission)
            {
                const submit = await Model.Submits.destroy({ where: { assignmentID: assignmentID } });
                if (!submit) {
                    res.json({ error: 'Failed to remove submissions' });
                    return;
                }
            }
            res.json({ status: 'success' });
        } else {
            res.json({ error: 'Failed to remove assignment' });
        }
    },

    viewSubmits: async (req, res) => { 
        const { assignmentID } = req.body;
        const submits = await Model.Submits.findAll({ where: { assignmentID: assignmentID } });
        if (submits) {
            res.json(submits);
        } else {
            res.json({ error: 'Failed to fetch submissions' });
        }
    },

    getFileFromAssignment: async (req, res) => { 
        console.log("getFileFromAssignment",req.body);
        const assignmentID = req.body.assignmentID;
        const assignment = await Model.Assignments.findOne({ where: { assignmentID: assignmentID } });
        if (assignment) {
            const file = await Model.Uploads.findOne({ where: { fileID: assignment.assignmentFile } });
            if (file) {
                console.log("getFileFromAssignment",file.fileInfo);
                res.json({ status: 'success', file: file.fileInfo });
            } else {
                res.json({ error: 'Failed to fetch file' });
            }
        } else {
            res.json({ error: 'Failed to fetch assignment' });
        }
    },

    editAssignment: async (req, res) => { 
        const assignmentID = req.body.assignmentID;
        const assignmentTitle = req.body.assignmentTitle;
        const assignmentDescription = req.body.assignmentDescription;
        const dueDate = req.body.dueDate;
        const file = req.file;

        const assignment = await Model.Assignments.findOne({ where: { assignmentID: assignmentID } });
        if (!assignment) {
            res.json({ error: 'Assignment not found' });
            return;
        }
        if (!file) {
            const updatedAssignment = await Model.Assignments.update({ 
                assignmentTitle: assignmentTitle,
                assignmentDescription: assignmentDescription,
                assignmentEndDate: dueDate
            }, { where: { assignmentID: assignmentID } });
            if (updatedAssignment) {
                res.json({ status: 'success' });
                return
            } else {
                res.json({ error: 'Failed to update assignment' });
                return
            }
        }
        const buffer = fs.readFileSync(file.path);

        if (file) {
            try {
                const newUpload = await Model.Uploads.create({ 
                    fileName: file.originalname,
                    fileInfo: buffer
                });
                if (newUpload) {
                    try {
                        const updatedAssignment = await Model.Assignments.update({
                            assignmentTitle: assignmentTitle,
                            assignmentDescription: assignmentDescription,
                            assignmentEndDate: dueDate,
                            assignmentFile: newUpload.fileID
                        }, { where: { assignmentID: assignmentID } });
                        if (updatedAssignment) {
                            res.json({ status: 'success' });
                        } else {
                            Model.Uploads.destroy({ where: { fileID: newUpload.fileID } });
                            res.json({ error: 'Failed to update assignment' });
                        }
                    } catch (error) {
                        console.error('Error updating assignment:', error);
                        res.json({ error: 'An error occurred while updating assignment' });
                    }
                } else { 
                    res.json({ error: 'Failed to upload file' });
                }
            } catch (error) {
                console.error('Error updating assignment:', error);
                res.json({ error: 'An error occurred while updating assignment' });
            }
        }
    },
    addClassGrade: async (req, res) => { 
        const { classID, accountID, grade } = req.body;
        const existingGrade = await Model.Participation.findOne({ where: { classID: classID, accountID: accountID } });
        if (existingGrade) {
            res.json({ error: 'Grade already exists' });
            return;
        }
        try {
            const newGrade = await Model.Participation.create({
                classID: classID,
                accountID: accountID,
                grade: grade
            });
            if (newGrade) {
                res.json({ status: 'success' });
            } else {
                res.json({ error: 'Failed to add grade' });
            }
        } catch (error) {
            console.error('Error adding grade:', error);
            res.json({ error: 'An error occurred while adding grade' } 
        )};
    },
    addGrade: async (req, res) => {
        const body = req.body;
        const classID = body.classID;
        const gradeName = body.gradeName;
        const gradePercentage = body.gradePercentage;
        if (!gradeName || !gradePercentage || gradePercentage < 0 || gradePercentage > 100) { 
            res.json({ error: 'Invalid grade' });
            return;
        }
        if (!classID) { 
            res.json({ error: 'Invalid class' });
            return;
        }
        const existingGrade = await Model.Grades.findOne({ where: { classID: classID, gradeName: gradeName } });
        if (existingGrade) {
            res.json({ error: 'Grade already exists' });
            return;
        }
        const students = await Model.Participation.findAll({ where: { classID: classID } });
        if (students) {
            for (let i = 0; i < students.length; i++) {
                const newGrade = await Model.Grades.create({
                    classID: classID,
                    gradeName: gradeName,
                    percentage: gradePercentage,
                    accountID: students[i].accountID,
                    grade: 0
                });
                console.log("newGrade", i,newGrade);
                if (!newGrade) {
                    res.json({ error: 'Failed to add grade' });
                    return;
                }
            }
            res.json({ status: 'success' });
        } else {
            res.json({ error: 'Failed to fetch students' });
        }
    },
    viewGrades: async (req, res) => { 
        const { classID } = req.body;
        try {
            const students = await Model.Participation.findAll({ where: { classID: classID } });
            console.log("students", students);
            console.log("classID", classID);

            if (students.length >= 0) {
                let grades = [];
                let gradeNames = new Set(); 

                const gradesPromises = students.map(async (student, index) => {
                    const studentGrades = await Model.Grades.findAll({ where: { classID: classID, accountID: student.accountID } });
                    
                    const grade = {
                        no: index + 1,
                        accountID: student.accountID,
                        count: studentGrades.length, 
                    };
                    let grs = [];
                    let total = 0;
                    studentGrades.forEach((studentGrade, j) => {
                        grs.push(studentGrade.grade);
                        gradeNames.add(studentGrade.gradeName + ' (' + studentGrade.percentage +'%)'); // Add grade name to Set
                        total += studentGrade.grade * studentGrade.percentage / 100;
                    });
                    grade.grades = grs;
                    grade.total = total;
                    return grade;
                });

                // Await all promises
                grades = await Promise.all(gradesPromises);
                console.log("grades",grades);
                // Convert Set to Array
                res.json({ grades: grades, gradeNames: Array.from(gradeNames) });
            } else {
                res.json({ error: 'Failed to fetch grades' });
            }
        } catch (error) {
            console.error('Error fetching grades:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    updateGrade: async (req, res) => { 
        const {grades, gradeNames, classID } = req.body;
        try {
            for (const gradeList of grades) {
                console.log("gradeList",gradeList);
                const studentID = gradeList.accountID;
                const grs = gradeList.grades;
                for (let i = 0; i < grs.length; i++) {
                    // Grade name 1 (10%) -> Grade name 1 
                    const gradeName = gradeNames[i].split(' (')[0];
                    const updateGrade = await Model.Grades.update(
                        { grade: grs[i] }, 
                        { where: { 
                            classID: classID, 
                            accountID: studentID, 
                            gradeName: gradeName 
                        }});
                        console.log("updateGrade",updateGrade);
                    if (!updateGrade) {
                        res.json({ error: 'Failed to update grade' });
                        return;
                    }
                    const newGrade = await Model.Grades.findOne({ where: { classID: classID, accountID: studentID, gradeName: gradeNames[i] } });
                    console.log("newGrade",newGrade);
                }
            }
            res.json({ status: 'success' });
        }
        catch (error) {
            console.error('Error updating grades:', error);
            res.json({ error: 'An error occurred while updating grades' });
        }
        
    },

    viewAnnouncements: async (req, res) => { 
        try {
            const { classID } = req.body;
            const announcements = await Model.Announcements.findAll
            ({ where: { classID: classID } ,
                include: [{
                    model: Model.Account,
                    required: true,
                    include: [{
                        model: Model.AccountInfo,
                        required: true
                    }]
                }]
            });
            if (announcements) {
                res.json({ announcements: announcements });
            } else {
                res.json({ error: 'Failed to fetch annoucements' });
            }
        }
        catch (error){
            console.error('Error fetching annoucements:', error);
            res.json({ error: 'An error occurred while fetching annoucements' });
        }
    },

    addAnnouncement: async (req, res) => { 
        try {
            const { classID, announcementTitle, announcementContent, accountID } = req.body;
            console.log("addAnnoucement",req.body);
            const newAnnouncement = await Model.Announcements.create({ 
                classID: classID,
                accountID: accountID,
                title: announcementTitle,
                content: announcementContent,
                date: new Date()
            });
            if (newAnnouncement) {
                res.json({ status: 'success' });
            } else {
                res.json({ error: 'Failed to create annoucement' });
            }
        }
        catch {
            console.error('Error creating annoucement:', error);
            res.json({ error: 'An error occurred while creating announcement' });
        }
       
    },

    removeAnnouncement: async (req, res) => { 
        try {
            const { announcementID } = req.body;
            const announcement = await Model.Announcements.destroy({ where: { announcementID: announcementID } });
            if (announcement) {
                res.json({ status: 'success' });
            } else {
                res.json({ error: 'Failed to remove annoucement' });
            }
        }
        catch (error) {
            console.error('Error removing annoucement:', error);
            res.json({ error: 'An error occurred while removing annoucement' });
        }
    },

    editAnnouncement: async (req, res) => { 
        try {
            const { announcementID, announcementTitle, announcementContent } = req.body;
            const announcement = await Model.Announcements.update({ 
                title: announcementTitle,
                content: announcementContent
            }, { where: { announcementID: announcementID } });
            if (announcement) {
                res.json({ status: 'success' });
            } else {
                res.json({ error: 'Failed to update annoucement' });
            }
        }
        catch (error) {
            console.error('Error updating annoucement:', error);
            res.json({ error: 'An error occurred while updating annoucement' });
        }
    },
}

async function getTeachingClasses(accountID) {
    const today = new Date();
    const enrolledClasses = await Model.Teachings.findAll({
        where: {
            accountID: accountID
        },
        include: [{
            model: Model.Class,
            required: true,
            where: {
                dateStart: { [Op.lte]: today },
                dateEnd: { [Op.gte]: today }
            },
            include: [{
                model: Model.Course,
                required: true
            }]
        }]
    });
    console.log("func",enrolledClasses);
    return enrolledClasses;
}


async function getModifiableCourses(accountID) {
    const modifiableCourses = await Model.Participation.findAll({
        where: {
            accountID: accountID
        }
    });
    let classes = []
    let today = Date()
    for (let i = 0; i < modifiableCourses.length; i++) {
        const cl = await Model.Class.findOne({
            where: {
                courseID: modifiableCourses[i].courseID,
                dateStart: {
                    [Op.gte]: today
                },
                dateClose: {
                    [Op.gte]: today
                }
            }
        });
        classes.push(cl);
    }
    return classes;
}

async function getFiles_NoData (sessionID) { 
    const classFiles = await Model.Uploads.findAll({
        attributes: ["fileID", "fileName", "sessionID"],
        where: {
            sessionID: sessionID
        }
    });
    return classFiles;
}

/* unused for now
async function getFiles_Data (classID)
{
    const classFiles = await Model.Uploads.findAll({
        attributes: ["fileID", "fileName", "accountID", "fileInfo"],
        where: {
            classID: classID
        }
    });
    return classFiles;
}
*/

async function getData(fileID) { // get binary data of specific file
    const data = await Model.Uploads.findOne({
        attributes: ["fileInfo"],
        where: {
            fileID: fileID
        }
    });
    return data.fileInfo; // return buffer of binary
}

function makeFileItem_NoData(result) { // change results from query to json
    data = []
    for (let i = 0; i < result.length; i++)
    {
        data.push({
            fileID: result[i].fileID,
            fileName: result[i].fileName,
            accountID: result[i].accountID
        })
    }
    return data
}