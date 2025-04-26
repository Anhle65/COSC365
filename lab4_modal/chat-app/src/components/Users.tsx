import axios from 'axios';
import React from "react";
import {Link, useNavigate} from "react-router-dom";
const Users = () => {
    const [users, setUsers] = React.useState <Array<User>> ([]);
    const userNames = users.map(u=>u.username);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const navigate = useNavigate();
    const [username, setUsername] = React.useState("");
    React.useEffect(() => {
        getUsers()
    }, [userNames])
    const updateUsernameState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value)
    }
    const getUsers = () => {
        axios.get('http://localhost:3000/api/users')
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setUsers(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    const deleteUser = (user: User) => {
        axios.delete('http://localhost:3000/api/users/' + user.user_id)
            .then((response) => {
                setUsers(users.filter(u => u.user_id !== user.user_id))
            })
    }
    const addUser = () => {
        if (username === "") {
            alert("Please enter a username!")
        } else {
            axios.post('http://localhost:3000/api/users', { "username": username })
                .then(() => navigate("/users/"));
        }
    }
    const editUser = (user: User) => {
        if (username === "") {
            alert("Please enter a username!")
        } else {
            axios.put('http://localhost:3000/api/users/' + user.user_id, {user_id: user.user_id, username: username})
                .then((response) => {
                    setUsername("");
                    navigate("/users/")
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
    }
    const list_of_users = () => {
        return users.map((item: User) =>
                <tr key={item.user_id}>
                    <th scope="row">{item.user_id}</th>
                    <td>{item.username}</td>
                    <td><Link to={"/users/" + item.user_id}>Go to user </Link></td>
                    <td>
                        <button type="button" className="btn btn-primary" data-toggle="modal"
                                data-target={`#deleteUserModal-${item.user_id}`}>
                            Delete
                        </button>
                        <div className="modal fade" id={`deleteUserModal-${item.user_id}`} tabIndex={-1} role="dialog"
                             aria-labelledby={`deleteUserModal-${item.user_id}Label`} aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id={`deleteUserModal-${item.user_id}Label`}>Delete
                                            User</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        Are you sure that you want to delete this user?
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">
                                            Close
                                        </button>
                                        <button type="button" className="btn btn-primary" data-dismiss="modal"
                                                onClick={() => deleteUser(item)}>
                                            Delete User {item.user_id}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary" data-toggle="modal"
                                data-target={`#editUserModal-${item.user_id}`}>Edit</button>
                        <div className="modal fade" id={`editUserModal-${item.user_id}`} tabIndex={-1} role="dialog"
                             aria-labelledby={`editUserModal-${item.user_id}Label`} aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id={`editUserModal-${item.user_id}Label`}>
                                            Edit User's name</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="modal-dialog modal-dialog-centered">
                                            Old user name: {item.username}
                                        </div>
                                        <form>
                                            <label htmlFor="fname">New user name:</label>
                                            <input type="text" value={username} onChange={updateUsernameState}/>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setUsername("")}>
                                            Close
                                        </button>
                                        <button type="button" className="btn btn-primary" data-dismiss="modal"
                                                onClick={() => editUser(item)}>
                                            Edit User {item.user_id}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
        )
    }
    if (errorFlag) {
        return (
            <div>
                <h1>Users</h1>
                <div style={{color: "red"}}>
                    {errorMessage}
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Users</h1>
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">username</th>
                        <th scope="col">link</th>
                        <th scope="col">actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {list_of_users()}
                    </tbody>
                </table>
                <h1>Add a new user</h1>
                <form onSubmit={addUser}>
                    <input type="text" value={username} onChange={updateUsernameState}/>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        )
    }
}
export default Users;