const {where, Op, and} = require('sequelize');
const { format } = require('date-fns');
const normalizeWeekday = require('../../ulti.js')
const Model = require('../../models/Models');
const fs = require('fs');

module.exports = {
    mainView: async (req, res) => {
        const { ID } = req.body;
        const info = await Model.AccountInfo.findOne({where: {accountID: ID}});
        if (info) {
            const data = {
                fullname: info.fullname
            }
            res.json(data);
        }
    },
    
    enrolledCourseView: async (req, res) => {
        const { ID } = req.body;
        const today = new Date();  // Use `new Date()` to get the current date
        try {
            const enrolledCourses = await Model.Participation.findAll({
                where: {
                    accountID: ID
                },
                include: [{
                    model: Model.Class,
                    required: true,
                    include: [{
                        model: Model.Course,
                        required: true
                    }]
                }]
            });
    
            if (enrolledCourses) {
                res.json(enrolledCourses);
            } else {
                res.json({ error: "Unable to fetch courses" });
            }
        } catch (error) {
            console.error("Error fetching enrolled courses:", error);
            res.json({ error: "An error occurred while fetching courses" });
        }
    },
    getRegisteredCourses: async (req, res) => { 
        try {
            
            const { ID } = req.body;
            const today = new Date();  // Use `new Date()` to get the current date
            const classes = await Model.Participation.findAll({ 
                where: { accountID: ID },
                include: [{
                    model: Model.Class,
                    required: true,
                    include: [{
                        model: Model.Course,
                        required: true
                    }]
                }]
            });
            const data = [];
            for (const cls of classes) { 
                const { courseID, courseName } = cls.Class.Course;
                const openingCourse = await Model.Open_registration.findOne({ 
                    where: { 
                        courseID: courseID, 
                        dateOpen: { [Op.lte]: today }, 
                        dateClose: { [Op.gte]: today } }
                });
                if (!openingCourse) { 
                    continue;
                }
                const { classID, className, weekday, timeStart, timeEnd, dateStart, dateEnd } = cls.Class;
                const cls = {classID: classID, className: className, weekday: normalizeWeekday(weekday), timeStart: timeStart, timeEnd: timeEnd, dateStart: dateStart, dateEnd: dateEnd};
                data.push(cls);
            }
            res.json({ status: 'success', courses: data });
        }
        catch {
            res.json({ status: 'failed', error: 'Failed to fetch courses' });
        }
    } ,

    
    openingCourseView: async (req, res) => {
        let today = Date();
        const openingCourses = await Model.Open_registration.findAll({
            attributes: ['courseID'],
            where : {
                dateOpen: {[Op.lte]: today},
                dateClose: {[Op.gte]: today}
            }
        });
        
        if (openingCourses) {
            const data = await getOpeningClasses(openingCourses);
            res.json({status: 'success', data: data});
        }
        else {
            res.json({status: 'failed', error: 'No courses available'});
        }
    },

    enrollCourseReq: async (req, res) => {
        let classes = req.body.classID;
        if (!Array.isArray(classes))
        {
            classes = [classes];
        }
        const ID = req.body.ID;    
        const courseName = req.body.courseName
        console.log("Received accountID (ID):", ID);
        ret = 'Successfully enrolled to';
        for (requestClass of classes)
            {
                console.log(requestClass);
                const exist = await hasEnrolled(ID, requestClass, courseName);
                if (exist)
                {
                    requestClass = 'You have already attended ' + exist;
                    res.json({status : requestClass});
                    return;
                }
                
                const slot = await isFull(requestClass);

                if (slot == -1)
                {
                    requestClass = requestClass + 'is full';
                    res.json({status : requestClass});
                    return;
                }

                await Model.Participation.create({
                    accountID: ID,
                    classID: requestClass
                });

                await updateSlot(requestClass, slot);
                ret += ' ' + requestClass;
            }
            res.json({status : ret});
    },

    viewScore: async (req, res) => {
        const { ID } = req.body;
        try {
            const scoreboard = await getScores(ID);

            if (scoreboard)
            {
                res.json({status: 'success', scores: scoreboard});
            } else {
                res.json({status: 'failed', error: 'Failed to fetch scores'});
            }
        } catch (error) { 
            console.error("Error fetching scores:", error);
            res.json({ status: 'failed', error: 'Failed to fetch scores' });
        }
    },

    registerCourse: async (req, res) => { 
        const { ID, classID } = req.body;
        const exist = await Model.Participation.findOne({ 
            where: { accountID: ID, classID: classID }
        });
        if (exist) { 
            res.json({ status: 'failed', error: 'You have already registered for this course' });
            return;
        }
        const slot = await isFull(classID);
        if (slot === -1) {
            res.json({ status: 'failed', error: 'Course is full' });
            return;
        }


        const newParticipation = await Model.Participation.create({ 
            accountID: ID, 
            classID: classID
        });
        if (newParticipation) {
            await updateSlot(classID, slot);
            res.json({ status: 'success' });
        } else {
            res.json({ status: 'failed', error: 'Failed to register course' });
        }
    },

    dropCourse: async (req, res) => { 
        const { ID, classID } = req.body;
        const deletedParticipation = await Model.Participation.destroy({ 
            where: { accountID: ID, classID: classID }
        });
        if (deletedParticipation) {
            res.json({ status: 'success' });
        } else {
            res.json({ status: 'failed', error: 'Failed to drop course' });
        }
    },

    viewSchedule: async (req, res) => { 
        const { ID } = req.body;
        const today = new Date();  // Use `new Date()` to get the current date
        try {
            const enrolledClasses = await Model.Participation.findAll({
                where: {
                    accountID: ID
                },
                include: [{
                    model: Model.Class,
                    required: true,
                    include: [{
                        model: Model.Course,
                        required: true
                    }]
                }]
            });
    
            let filteredClasses = [];
            for (const cls in enrolledClasses) {
                if (cls.Class.dateStart <= today && cls.Class.dateEnd >= today) {
                    filteredClasses.push(cls);
                }
            }
            let schedule = [];
            const dayMap = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            for (const cls in filteredClasses) {
                const { courseID, courseName } = cls.Class.Course;
                const classID = cls.Class.classID;
                const weekday = cls.Class.weekday;
                const timeStart = cls.Class.timeStart;
                const timeEnd = cls.Class.timeEnd;
                const location = cls.Class.location;
                const name = courseID + ' - ' + classID;
                const s = {name: name, day: dayMap[weekday - 2], time: timeStart + ' - ' + timeEnd, location: location};
                schedule.push(s);
            }
            if (schedule) {
                res.json({ status: 'success', schedule: schedule });
            } else { 
                res.json({status: 'failed', error: 'No classes available'});
            }
        } catch (error) {
            console.error("Error fetching enrolled courses:", error);
            res.json({ error: "An error occurred while fetching courses" });
        }
    },

    viewCourseGrade: async (req, res) => {
        try {
            const { accountID, classID } = req.body;
            const grades = await Model.Grades.findAll({
                where: {
                    accountID: accountID,
                    classID: classID
                }
            });
            if (!grades) {
                res.json({ status: 'failed', error: 'Failed to fetch grades' });
                return;
            }
            let overall = 0;
            for (const grade of grades) {
                overall += grade.grade * grade.percentage / 100;
            }
            res.json({ status: 'success', grades: grades, overall: overall });
        }
        catch (error){
            console.error("Error fetching grades:", error);
            res.json({ status: 'failed', error: 'Failed to fetch grades' }); 
        }
    },

    viewAssignmentFiles: async (req, res) => { 
        try {
            const { assignmentID } = req.body;
            const assignment = await Model.Assignments.findOne({where: {assignmentID: assignmentID}});
            const files = await Model.Uploads.findOne({where: {fileID: assignment.assignmentFile}});            
            if (files) {
                const data = { fileName: files.fileName, fileInfo: files.fileInfo };
                res.json({ status: 'success', files: data });
            } else {
                res.json({ status: 'sucess', files: [] });
            }
        }catch (error) { 
            console.error("Error fetching assignment files:", error);
            res.json({ status: 'failed', error: 'Failed to fetch assignment files' });
        }
    },

    viewSubmit: async (req, res) => { 
        try {
            const { assignmentID, accountID } = req.body;
            console.log("Received assignmentID:", assignmentID, "accountID:", accountID);
            const submit = await Model.Submits.findOne({
                where: {
                    assignmentID: assignmentID,
                    accountID: accountID
                }
            });
            if (!submit) { 
                res.json({status: 'success', submit: []});
                return;
            }
            const file = await Model.Uploads.findOne({where: {fileID: submit.submitFile} });
            console.log("Submit:", submit, "File:", file);
            if (submit) {
                res.json({ status: 'success', submit: file });
            } else {
                res.json({ status: 'failed', error: 'Failed to fetch submit' });
            }
        }catch (error) { 
            console.error("Error fetching submit:", error);
            res.json({ status: 'failed', error: 'Failed to fetch submit' });
        }
    },

    submitAssignment: async (req, res) => { 
        try {
            console.log('Received submit request:', req.body);
            const assignmentID = req.body.assignmentID;
            const accountID = req.body.accountID;
            const file = req.file;
            const exist = await Model.Submits.findOne({
                where: {
                    assignmentID: assignmentID,
                    accountID: accountID
                }, include: [{ 
                    model: Model.Uploads,
                    required: true
                }]
            });
            const buffer = fs.readFileSync(file.path);
            if (exist) {
                const updatedSubmit = await Model.Submits.update({
                    submitDate: new Date(),
                }, {
                    where: {
                        assignmentID: assignmentID,
                        accountID: accountID
                    }
                });
                const updatedUpload = await Model.Uploads.update({                    
                    fileName: file.originalname,
                    fileInfo: buffer
                }
                    , {where: {fileID: exist.submitFile}});
                if (!updatedSubmit) { 
                    res.json({ status: 'failed', error: 'Failed to submit assignment' });
                    return;
                }
                res.json({ status: 'success' });
                return;
            }
            const newUpload = await Model.Uploads.create({ 
                fileName: file.originalname,
                fileInfo: buffer
            });
            if (!newUpload) { 
                res.json({ status: 'failed', error: 'Failed to submit assignment' });
                return;
            }
            const newSubmit = await Model.Submits.create({
                assignmentID: assignmentID,
                accountID: accountID,
                submitDate: new Date(),
                submitFile: newUpload.fileID
            });
            if (newSubmit) {
                res.json({ status: 'success' });
            } else {
                res.json({ status: 'failed', error: 'Failed to submit assignment' });
            }
        } catch (error) { 
            console.error("Error submitting assignment:", error);
            res.json({ status: 'failed', error: 'Failed to submit assignment' });
        }
    }
};



async function getOpeningClasses(courses) {
    let data = [];
    const dayMap = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    for (const course of courses)
    {
        const openingClasses = await Model.Class.findAll({
            where: {
                courseID: course.courseID
            },
            include: [{
                model: Model.Course,
                where: {
                    courseID: course.courseID
                },
                attributes: ['courseName']
            }]
        });

        for (const openingClass of openingClasses)
        {

            const dat = {
                courseID: openingClass.courseID,
                courseName: openingClass.Course.courseName,
                classID : openingClass.classID,
                weekday: dayMap[openingClass.weekday - 2],
                timeStart: openingClass.timeStart,
                timeEnd: openingClass.timeEnd,
                dateStart: format(openingClass.dateStart, 'dd-MM-yyyy'),
                dateEnd: format(openingClass.dateEnd, 'dd-MM-yyyy')
            };
            data.push(dat);
            
        }
    }
    return data;
}
async function updateSlot(classID, oldNum) {
    const flag = await Model.Class.update({
        enrolledNum: oldNum + 1
    },{
        where: {
            classID: classID
        }
    });
    if (flag)
        return true;
    else
        return false;
}
async function isFull(classID) {
    const Class = await Model.Class.findOne({
        where: {
            classID: classID
        }
    });

    if (Class.enrolledNum < Class.maxSlot)
        return Class.enrolledNum;
    else
        return -1;
}
async function hasEnrolled(accountID, classID, courseName) {
    let classes = await Model.Participation.findOne({
        where: {
            accountID: accountID,
            classID: classID
        }
    });
    const course_name = await Model.Course.findOne({
        where: {
            courseName: courseName
        },
        include: [{
            model: Model.Class,
            required: true,
            include: [{
                model: Model.Participation,
                required: true,
                where: {
                    accountID: accountID
                }
            }]
        }]
    });
    if (course_name !== null){
        return courseName;
    }
    if (classes !== null)
    {
        return classID;
    }
    return null;
}
async function getScores(id) {
    let data = [];

    const availableScores = await Model.Scores.findAll({
        attributes: ['scores'],
        where: {
            accountID: id
        },
        include: [{
            model: Model.Course,
            attributes: ['courseID', 'courseName']
        }]
    });

    for (const item in availableScores)
    {
        const dat = {
            courseID: item.Course.courseID,
            courseName: item.Course.courseName,
            grade: item.scores,
            credit: item.Course.credit
        };

        data.push(dat)
    }

    return data;
}

