function Class_item({class_item}) {
    let ti = class_item.timeStart + ' - ' + class_item.timeEnd
    let da = class_item.dateStart + ' - ' + class_item.dateEnd
    return (
        <>
            <td id="col_left">{class_item.classID}</td>
            <td>{class_item.courseID}</td>
            <td>{class_item.weekday}</td>
            <td>{ti}</td>
            <td>{da}</td>
            <td>{class_item.location}</td>
            <td id="col_right">{class_item.lecturer}</td>
        </>
    );
}

export default Class_item