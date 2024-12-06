function Course_item({name,courseClass,credit}) {
  const displayName = name + ' - ' + courseClass;
  return (
    <div className='course_item'>
        <p>{displayName}</p>
        <p>{credit}</p>
    </div>
  )
}

export default Course_item