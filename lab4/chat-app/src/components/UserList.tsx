import React from "react";
import axios from "axios";
import User from "./User";
import CSS from 'csstype';
import {Alert, AlertTitle, Paper} from "@mui/material";
import UserListObject from "./UserListObject";

const UserList = () => {
    const [users, setUsers] = React.useState<Array<User>>([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    React.useEffect(() => {
            const getUsers = () => {
                axios.get('http://localhost:3000/api/users')
                    .then((response) => {
                        setErrorFlag(false);
                        setUsers(response.data);
                        setErrorMessage("");
                    }, (error) => {
                        setErrorFlag(true);
                        setErrorMessage(error.toString() + " defaulting to old users changes app may not work as expected")
                    })
            }
            getUsers();
        }, [setUsers]
    )
    const user_rows = () => users.map((user: User) => <UserListObject key={user.user_id + user.username} user={user}/>);
    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "block",
        width: "fit-content"
    }
    return (
        <Paper elevation={3} style={card} >
            <h1>UserList </h1>
            <div style={{ display: "inline-block", maxWidth: "965px", minWidth: "320px" }}>
                { errorFlag ? (
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                ) : null }
                { user_rows() }
            </div>
        </Paper>
    )

}
export default UserList;