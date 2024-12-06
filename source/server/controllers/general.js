const Model = require('../models/Models');
const normalizeWeekday = require('../ulti');

module.exports = {
    loginReq: async (req, res) => {
        const {username, password} = req.body;

        const dbU = await Model.Account.findOne({ where: { username } });

        if (dbU) {
            if (dbU.password === password)
            {
                res.json({
                    user: {
                        ID : dbU.accountID,
                        role: dbU.role                                    
                    },
                    error : null
                });
            } else {
                res.json({
                    user: null,                
                    error : 'Invalid password'
                });
            }
        } else {
            res.json({
                user: null,
                error: 'User not found'
            });
        }
    },
    getAccountInfo: async (req, res) => {
        const { ID } = req.body;
        info = await Model.AccountInfo.findOne({where: {accountID: ID}});
        if (info) {
            const data = {
                fullname: info.fullname
            }
            res.json(data);
        }
    },
    getCourseInfo: async (req, res) => {
        try {
            const { classID } = req.body;
            const classInfo = await Model.Class.findOne(
                { where: { classID: classID },
                include: [{
                    model: Model.Course,
                    required: true
                }]
                });
                
            if (classInfo) {
                const lecturer = await Model.Teachings.findOne({ 
                    where: { classID: classID },
                    include: [{
                        model: Model.Account,
                        required: true,
                        include: [{
                            model: Model.AccountInfo,
                            required: true
                        }]
                    }]
                });
                if (!lecturer) { 
                    res.json({ error: 'Failed to fetch lecturer' });
                    return;
                }
                res.json(
                    {
                        classInfo: {
                            courseID: classInfo.courseID,
                            courseName: classInfo.Course.courseName,
                            credit: classInfo.Course.credit,
                            location: classInfo.location,
                            weekday: normalizeWeekday(classInfo.weekday),
                            timeStart: classInfo.timeStart,
                            timeEnd: classInfo.timeEnd
                        },
                        lecturer: lecturer.Account.AccountInfo.fullname
                    }
                );
            } else {
                res.json({ error: 'Failed to fetch class information' });
            }
        }
        catch (error) {
            console.error('Error fetching class information', error);
            res.json({ error: 'An error occurred while fetching class information' }); 
        }
    }

}