import axios from 'axios';
import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {
    Alert,
    AlertTitle,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Paper, Snackbar,
    Stack,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import CSS from 'csstype';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const card: CSS.Properties = {
    padding: "10px",
    margin: "20px",
}
interface HeadCell {
    id: string;
    label: string;
    numeric: boolean;
    }

const headCells: readonly HeadCell[] = [
    { id: 'ID', label: 'id', numeric: true },
    { id: 'username', label: 'Username', numeric: false },
    { id: 'link', label: 'Link', numeric: false },
    { id: 'actions', label: 'Actions', numeric: false }
    ];

const Users = () => {
    const [users, setUsers] = React.useState <Array<User>> ([]);
    const userNames = users.map(u=>u.username);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const navigate = useNavigate();
    const [username, setUsername] = React.useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const [dialogUser, setDialogUser] = React.useState<User>({ username: "", user_id: -1 })
    const [openEditDialog, setOpenEditDialog] = React.useState(false)

    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")

    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    const handleSnackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
            }
        setSnackOpen(false);
        };

    const handleEditDialogOpen = (user: User) => {
        setSelectedUser(user);
        setDialogUser(user)
        setOpenEditDialog(true);
    };
    const handleDeleteDialogClose = () => {
        setDialogUser({ username: "", user_id: -1 })
        setOpenDeleteDialog(false);
    };
    const handleEditDialogClose = () => {
        setDialogUser({ username: "", user_id: -1 })
        setUsername("");
        setOpenEditDialog(false);
    };
    const handleDeleteDialogOpen = (user: User) => {
        setSelectedUser(user);
        setDialogUser(user)
        setOpenDeleteDialog(true);
    };
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
                setErrorMessage("")
                setUsers(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    const deleteUser = (user: User) => {
        setSnackMessage("User deleted successfully")
        setSnackOpen(true)
        axios.delete('http://localhost:3000/api/users/' + user.user_id)
            .then((response) => {
                setUsers(users.filter(u => u.user_id !== user.user_id))
            })
    }
    const addUser = () => {
        if (username === "") {
            setErrorFlag(true)
        } else {
            setSnackMessage("New user is added successfully")
            setSnackOpen(true)
            setUsername("");
            axios.post('http://localhost:3000/api/users', { "username": username })
                .then(() => navigate("/users/"));
        }
    }
    const editUser = (user: User) => {
        if (username === "") {
            alert("Please enter a username!")
        } else {
            setSnackMessage("Username changed successfully")
            setSnackOpen(true)
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

    const user_rows = () => {
        return users.map((row: User) =>
        <TableRow hover tabIndex={-1} key={row.user_id}>
            <TableCell align="center">
                {row.user_id}
            </TableCell>
            <TableCell align="center">{row.username}</TableCell>
            <TableCell align="center"><Link to={"/users/"+row.user_id}>
                Go to user</Link></TableCell>
            <TableCell align="center">
                <Button variant="outlined" endIcon={<EditIcon />} onClick={()=> {handleEditDialogOpen(row)}}>
                    Edit
                </Button>
                <Dialog
                    open={openEditDialog}
                    onClose={handleEditDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        {`Renaming "${selectedUser?.username}" to:`}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <TextField id="outlined-basic" label="Username" variant="outlined"
                                       value={username} onChange={updateUsernameState} />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditDialogClose}>Cancel</Button>
                        <Button variant="outlined" color="error" onClick={() => {
                            if (selectedUser) editUser(selectedUser)
                            setSelectedUser(null);
                            handleEditDialogClose();
                        }} autoFocus>
                            Save changes
                        </Button>
                    </DialogActions>
                </Dialog>

                <Button variant="outlined" endIcon={<DeleteIcon />} onClick={() => { handleDeleteDialogOpen(row)}}>
                    Delete
                </Button>
                <Dialog
                    open={openDeleteDialog}
                    onClose={handleDeleteDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        {"Delete User?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this user?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                        <Button variant="outlined" color="error" onClick={() => {
                            if(selectedUser) deleteUser(selectedUser)
                            setSelectedUser(null);
                            handleDeleteDialogClose();
                        }} autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    autoHideDuration={3000}
                    open={snackOpen}
                    onClose={handleSnackClose}
                    key={snackMessage}
                >
                    <Alert onClose={handleSnackClose} severity="success" sx={{
                        width: '100%'
                    }}>
                        {snackMessage}
                    </Alert>
                </Snackbar>
            </TableCell>
        </TableRow>)
    }
    if (errorFlag) {
        return (
            <div>
                {/*<h1>Users</h1>*/}
                {/*<div style={{color: "red"}}>*/}
                {/*    {errorMessage}*/}
                {/*</div>*/}
                {errorFlag &&
                    <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                    </Alert>}
            </div>
        )
    } else {
        return (
            <div>

                <Paper elevation={3} style={card}>
                    <h1>Users</h1>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {headCells.map((headCell) => (
                                        <TableCell
                                                key={headCell.id}
                                                align="center"
                                                padding={'normal'}>
                                            {headCell.label}
                                        </TableCell>
                                        ))}
                                </TableRow>
                            </TableHead>
                            {user_rows()}
                        </Table>
                    </TableContainer>
                </Paper>
                <Paper elevation={3} style={card}>
                    <h1>Add a new user</h1>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <TextField id="outlined-basic" label="Username" variant="outlined" value={username}
                        onChange={(event) => setUsername(event.target.value)} />
                        <Button variant="outlined" onClick={() => { addUser() }}>
                            Submit
                        </Button>
                        <Snackbar
                            autoHideDuration={3000}
                            open={snackOpen}
                            onClose={handleSnackClose}
                            key={snackMessage}
                        >
                            <Alert onClose={handleSnackClose} severity="success" sx={{
                                width: '100%'
                            }}>
                                {snackMessage}
                            </Alert>
                        </Snackbar>
                    </Stack>
                </Paper>
            </div>
        )
    }
}
export default Users;