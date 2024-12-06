const normalizeWeekday = (weekday) => {
    const dayMap = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return dayMap[weekday-2];
}

module.exports = normalizeWeekday;