const Model = require('../../models/Models');
const { Op, fn, col, where } = require('sequelize');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const path = require('path');
const fs = require('fs');
const { error } = require('console');
const normalizeWeekday = require('../../ulti');

module.exports = {
    infoView: async (req, res) => {
        info = await Model.AccountInfo.findOne({where: {accountID: req.session.accountID}});
        if (info) {
            const data = {
                information: {
                    fullname: info.fullname,
                    role: info.role
                }
            }
            res.json(data);
        }
    },
    viewExistStudents: async (req, res) => {
        console.log('viewExistStudents');
        const studentList = await getStudentList();
        if (studentList) {
            res.json({status: 'success', students: studentList});
        } else {
            res.json({status: 'fail', error: 'Failed to fetch students'});
        }
    },
    viewExistStaffs: async (req, res) => {
        const staffList = await getStaffList();
        if (staffList) {
            res.json({status: 'success', staffs: staffList});
        }
    },
    viewExistCourses: async (req, res) => {
        const courseList = await getCourseList();
        if (courseList) {
            const data = {
                courses: courseList
            };
            res.json({status: 'success', courses: courseList});
        } else {
            res.json({status: 'fail', error: 'No courses found'});
        }
    },
    viewExistClasses: async (req, res) => {
        const classList = await getClassList();
        if (classList) {
            const data = {
                classes: classList
            };
            res.json({status: 'success', classes: classList});
        }
    },
    addStudentStaff: async (req, res) => {
        const { username, fullname, role } = req.body;

        // handle file upload
        const file = req.file;
        if (file) {
            const filePath = path.join(__dirname, 'uploads', file.filename);
            fs.readFile(file.path, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ status: 'fail', error: 'Error reading file' });
                }
                const lines = data.split('\r\n').filter(line => line.trim());
                const results = [];
                let errors = [];
                for (const line of lines) {
                    const [username, fullname, role] = line.split(',').map(field => field.trim());
                    if (!username || !fullname || (role !== 1 && role !== 2)) {
                        errors.push(`Invalid line: ${line}`);
                        continue;
                    }
                    if (isNaN(username)) {
                        errors.push(`Invalid username: ${username} in line ${line}` );
                        continue;
                    }
                    results.push({ username, fullname, role });
                }
                fs.unlink(file.path, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                if (errors.length) {
                    return res.status(400).json({ status: 'fail', errors });
                }
                for (const result of results) {
                    const newStudent = addStudentStaff(result.username, result.fullname, result.role);
                    if (!newStudent) {
                        errors.push(`Account ${result.username} already exists`);
                    }
                }
                console.log('Results: ', results);
                res.json({ status: 'success', errors });
            });        
        }else {
            newStudent = await addStudentStaff(username, fullname, role);
            if (newStudent) {
                res.json({ status: 'success' });
            } else {
                res.json({ status: 'fail', error: 'Account already exists' });
            }
        }
    },
    addCourse: async (req, res) => {
        const { courseID, courseName, credit , dateOpen, dateClose} = req.body;
        newCourse = await addCourse(courseID, courseName, credit);
        if (newCourse) {
            const registration = await Model.Open_registration.create({
                courseID: courseID,
                dateOpen: dateOpen,
                dateClose: dateClose
            })
            res.json({ status: 'success' });
        } else {
            res.json({ status: 'fail', error: 'Course already exists' });
        }
    },
    addClass: async (req, res) => {
        const existClass = await Model.Class.findOne({where: {classID: req.body.classID}});
        console.log('existClass');
        if (existClass) {
            return res.json({ status: 'fail', error: 'Class already exists' });
        }
        console.log(req.body);
        const existCourse = await Model.Course.findOne({
            where: where(fn('BINARY', col('courseID')), req.body.courseID)
        });
        if (!existCourse) {
            return res.json({ status: 'fail', error: 'Course does not exist' });
        }

        const { classID, courseID, semester, weekday, maxSlot, timeStart, timeEnd, location, dateStart, dateEnd } = req.body;
        newClass = await addClass(classID, courseID, semester, weekday, maxSlot, timeStart, timeEnd, location, dateStart, dateEnd);
        if (newClass) {
            res.json({ status: 'success' });
        } else {
            res.json({ status: 'fail', error: 'Database create error' });
        }
    },
    editCourse: async (req, res) => { 
        const { courseID, courseName, courseCredit, dateOpen, dateClose } = req.body;
        console.log('editCourse', courseID, courseName, courseCredit, dateOpen, dateClose);
        console.log('editCourse2', courseCredit);
        const course = await Model.Course.findOne({where: {courseID: courseID}});
        if (!course) {
            return res.json({ status: 'fail', error: 'Course does not exist' });
        }
        try {
            course.courseName = courseName;
            course.credit = courseCredit;
            const registration = await Model.Open_registration.findOne({where: {courseID: courseID}});
            if (!registration) { 
                newRegistration = await Model.Open_registration.create({ courseID: courseID, dateOpen: dateOpen, dateClose: dateClose });
            } else {
                registration.dateOpen = dateOpen;
                registration.dateClose = dateClose;
                await course.save();
            }
            await registration.save();
            res.json({ status: 'success' });
        }
        catch (error) { 
            console.log(error);
            return res.json({ status: 'fail', error: 'Database error' });
        }
        
    },
    editClass: async (req, res) => {
        const dayWeek = ['Zero', 'One', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        console.log('editClass', req.body);
        const { classID, courseID, weekday, timeStart, timeEnd, dateStart, dateEnd, location, accountID } = req.body;
        existAcc = await Model.Account.findOne({});;
        if (accountID.length > 0) { 
            existAcc = await Model.Account.findOne({where: {accountID: accountID, role: 2}});
        } else {
            // existAcc = await Model.Account.findOne({});
            existAcc = true
        }
        const existClass = await Model.Class.findOne({where: {classID: classID}});
        if (!existClass || !existAcc) {
            return res.json({ status: 'fail', error: 'Class or lecturer does not exist' });
        }
        const existTeacher = await Model.Teachings.findOne({where: {accountID: accountID, classID: classID}})
        // if(existTeacher) {
        //     return res.json({status: 'fail', error: 'This lecturer is already in this class'})
        // }
        existClass.courseID = courseID;
        existClass.weekday = dayWeek.indexOf(weekday);
        existClass.timeStart = timeStart;
        existClass.timeEnd = timeEnd;
        existClass.location = location;
        existClass.dateStart = dateStart;
        existClass.dateEnd = dateEnd;
        await existClass.save();
        if (accountID.length > 0 && !existTeacher) {
            const teaching = await Model.Teachings.create({
                accountID: accountID,
                classID: classID
            })
        }
        else if (accountID.length === 0) {
            const removed = await Model.Teachings.destroy({
                where: {
                    classID: classID
                }
            })
        }
        res.json({ status: 'success' });
    },
    editStudentStaff: async (req, res) => { 
        const { accountID, fullname, password } = req.body;
        const account = await Model.Account.findOne({where: {accountID: accountID}});
        if (!account) {
            return res.json({ status: 'fail', error: 'Account does not exist' });
        }
        const accountInfo = await Model.AccountInfo.findOne({where: {accountID: accountID}});
        if (!accountInfo) {
            return res.json({ status: 'fail', error: 'Account info does not exist' });
        }
        accountInfo.fullname = fullname;
        account.password = password;
        await accountInfo.save();
        await account.save();
        res.json({ status: 'success' });
    },
    deleteCourse: async (req, res) => {
        const { courseID } = req.body;
        const course = await Model.Course.findOne({where: {courseID: courseID}});
        if (!course) {
            return res.json({ status: 'fail', error: 'Course does not exist' });
        }
        const courseClasses = await Model.Class.findAll({where: {courseID: courseID}});
        for (const courseClass of courseClasses) {
            let classID = courseClass.classID;
            const classParticipations = await Model.Participation.findAll({where: {classID: classID}});
            for (const classParticipation of classParticipations) {
                await classParticipation.destroy();
            }
            const classTeachings = await Model.Teachings.findAll({where: {classID: classID}});
            for (const classTeachings of classTeachings) {
                await classTeachings.destroy();
            }
            await courseClass.destroy();
        }
        const registration = await Model.Open_registration.findOne({where: {courseID: courseID}});
        if (registration)
            await registration.destroy();
        await course.destroy();
        res.json({ status: 'success' });
    },
    deleteClass: async (req, res) => {
        const { classID } = req.body;
        const courseClass = await Model.Class.findOne({where: {classID: classID}});
        if (!courseClass) {
            return res.json({ status: 'fail', error: 'Class does not exist' });
        }
        await courseClass.destroy();
        const classParticipations = await Model.Teachings.findAll({where: {classID: classID}});
        for (const classParticipation of classParticipations) {
            await classParticipation.destroy();
        }
        res.json({ status: 'success' });
    },
    deleteStudentStaff: async (req, res) => { 
        const { accountID } = req.body;
        const account = await Model.Account.findOne({where: {accountID: accountID}});
        if (!account) {
            return res.json({ status: 'fail', error: 'Account does not exist' });
        }
        const accountInfo = await Model.AccountInfo.findOne({where: {accountID: accountID}});
        if (!accountInfo) {
            return res.json({ status: 'fail', error: 'Account info does not exist' });
        }
        const participations = await Model.Participation.findAll({where: {accountID: accountID}});
        for (const participation of participations) {
            await participation.destroy();
        }
        await account.destroy();
        await accountInfo.destroy();
        res.json({ status: 'success' });
    },

    getLecturer: async (req, res) => { 
        const classID = req.body.classID;
        const lecturer = await Model.Teachings.findAll({where: {classID: classID}});
        if (lecturer) {
            res.json({ status: 'success', lecturer: lecturer });
        } else {
            res.json({ status: 'fail', error: 'Failed to fetch lecturer' });
        }
    }
};

async function getStudentList() {
    stuList = await Model.Account.findAll({where: {role: 1}});
    data = [];
    for (let i = 0; i < stuList.length; i++) {
        accountinf = await Model.AccountInfo.findOne({where: {accountID: stuList[i].accountID}});
        data.push({
            accountID: stuList[i].accountID,
            fullname: accountinf ? accountinf.fullname : "unknown",
            password: stuList[i].password
        });
    }
    return data;
}

async function getStaffList() {
    staffList = await Model.Account.findAll({where: {role: 2}});
    data = [];
    for (let i = 0; i < staffList.length; i++) {
        accountinf = await Model.AccountInfo.findOne({where: {accountID: staffList[i].accountID}});
        data.push({
            accountID: staffList[i].accountID,
            fullname: accountinf ? accountinf.fullname : "unknown",
            password: staffList[i].password
        });
    }
    return data;
}

async function getCourseList() {
    courseList = await Model.Open_registration.findAll({include: Model.Course});
    data = [];
    for (let i = 0; i < courseList.length; i++) {
        data.push({
            courseID: courseList[i].Course.courseID,
            courseName: courseList[i].Course.courseName,
            credit: courseList[i].Course.credit,
            dateOpen: courseList[i].dateOpen,
            dateClose: courseList[i].dateClose
        });
    }
    return data;
}

async function getClassList() {
    classList = await Model.Class.findAll();
    data = [];
    for (let i = 0; i < classList.length; i++) {
        const participations = await Model.Teachings.findAll({where: {classID: classList[i].classID}});
        let lecturerName = [];
        for (let j = 0; j < participations.length; j++) {
            const staff = await Model.AccountInfo.findOne({where: {accountID: participations[j].accountID}});
            if (staff) {
                lecturerName.push(staff.fullname);
            }
        }
        console.log('lecturerName: ', lecturerName);
        console.log('Date: ', formatSQLDateToString(classList[i].dateStart), formatSQLDateToString(classList[i].dateEnd));
        console.log('Time: ', formatSQLTimeToHHMM(classList[i].timeStart), formatSQLTimeToHHMM(classList[i].timeEnd));
        data.push({
            classID: classList[i].classID,
            courseID: classList[i].courseID,
            weekday: normalizeWeekday(classList[i].weekday),
            timeStart: formatSQLTimeToHHMM(classList[i].timeStart),
            timeEnd: formatSQLTimeToHHMM(classList[i].timeEnd),
            location: classList[i].location,
            dateStart: formatSQLDateToString(classList[i].dateStart),
            dateEnd: formatSQLDateToString(classList[i].dateEnd),
            semester: classList[i].semester,
            lecturer: lecturerName
        });
    }
    return data;
}

const formatSQLDateToString = (sqlDate) => {
    const date = new Date(sqlDate);  // Convert SQL date/datetime to JavaScript Date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options); // e.g., "August 18, 2024"
};

const formatSQLTimeToHHMM = (sqlTime) => {
    const [hours, minutes] = sqlTime.split(':');  // Extract hours and minutes
    return `${hours}:${minutes}`;
};

async function addStudentStaff(username, fullname, role) {

    try {
        const newStudent = await Model.Account.create({
            username: username,
            password: '123',
            role: role
        });
        console.log("newStudent: ", newStudent);
        const newStudentInfo = await Model.AccountInfo.create({
            accountID: newStudent.accountID,
            fullname: fullname,
        });
        console.log("newStudentInfo: ", newStudentInfo);
        return newStudent;
    }
    catch (error) {
        return null;
    }
}


async function addCourse(courseID, courseName, credit) { // more parameters can be added
    try {
        const newCourse = await Model.Course.create({
            courseID: courseID,
            courseName: courseName,
            credit: credit
        });
        console.log("newCourse: ", newCourse);
        return newCourse;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}

async function addClass(classID, courseID, semester, weekday, maxSlot, startTime, endTime, location, dateStart, dateEnd) { // more parameters can be added
    console.log('addClass');
    console.log('classID: ', classID, 'courseID: ', courseID, 'semester: ', semester, 'weekday: ', weekday, 'maxSlot: ', maxSlot, 'startTime: ', startTime, 'endTime: ', endTime, 'location: ', location, 'dateStart: ', dateStart, 'dateEnd: ', dateEnd);
    try {
        const newClass = await Model.Class.create({
            classID: classID,
            courseID: courseID,
            semester: semester,
            weekday: weekday,
            maxSlot: maxSlot,
            timeStart: startTime,
            timeEnd: endTime,
            location: location,
            dateStart: dateStart,
            dateEnd: dateEnd
        });
        return newClass;
    }
    catch (error) {
        console.log(error);
        console.log(classID, courseID, semester, weekday, startTime, endTime, location, dateStart, dateEnd);
        return null;
    }
}