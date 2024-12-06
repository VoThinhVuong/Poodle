import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const [username, setUsername] = useState('');
    const [isSubmit, setSubmit] = useState('');
    const handleSubmit = (event) => {
        event.preventDefault();
        if (username)
            setSubmit(true);
    }

    const SubmitInform = () => {
        return (
            <div>
                <div>Your problem has been reported to the monitor, please wait for a recovery email</div>
                <Link to="/login">Return to login site</Link>
            </div>
        )
    }

    return (
        <div className="DBM_container">
            <h1>Recovery password</h1>
            {isSubmit ? <SubmitInform/> : null}
            <div className="Create_Acc_Form">
            <form onSubmit={handleSubmit}>
                <label>
                <input type='text' placeholder="username" name="username" value={username} onChange={(event) => {setUsername(event.target.value)}}/>
                </label>
                <br/>
                <label className="forgetPassWord">
                <input type="submit" value='Send Request'/>
                </label>
                
            </form>
            </div>
            
        </div>
    );
}