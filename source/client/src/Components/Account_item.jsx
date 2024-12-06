import "../styles/DBM/viewStudents.css"

function Account_item({account}) {
    return (
        <div className='account_item'>
            <p>{'Account ID: ' + account.accountID}</p>
            <p>{'Full Name: ' + account.fullname}</p>
            <p>{'Password: ' + account.password}</p>
        </div>
    )
}

export default Account_item