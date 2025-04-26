import {Link, useNavigate, useParams} from "react-router-dom";
import React from "react";
import axios from "axios";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Snackbar,
    TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const User = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [user, setUser] = React.useState<User>({user_id:0, username: ""});
    const [username, setUsername] = React.useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const [dialogUser, setDialogUser] = React.useState<User>({ username: "", user_id: -1 })
    const [openEditDialog, setOpenEditDialog] = React.useState(false)
    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")
    const handleSnackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };
    const handleDeleteDialogOpen = (user: User) => {
        setDialogUser(user)
        setOpenDeleteDialog(true);
    };
    const handleDeleteDialogClose = () => {
        setDialogUser({ username: "", user_id: -1 })
        setOpenDeleteDialog(false);
    };
    const handleEditDialogOpen = (user: User) => {
        setDialogUser(user)
        setOpenEditDialog(true);
    };
    const handleEditDialogClose = () => {
        setDialogUser({ username: "", user_id: -1 })
        setUsername("");
        setOpenEditDialog(false);
    };

    const deleteUser = (user: User) => {
        axios.delete('http://localhost:3000/api/users/' + user.user_id)
            .then((response) => {
                navigate('/users')
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    const updateUsernameState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value)
    }
    const editUser = (user: User) => {
        // event.preventDefault();
        if (username === "") {
            alert("Please enter a username!")
        } else {
            setSnackMessage("Username changed successfully")
            setSnackOpen(true)
            axios.put('http://localhost:3000/api/users/' + user.user_id, {id, username})
                .then((response) => {
                    navigate('/users/')
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })

        }
    }

    React.useEffect(() => {
        const getUser = () => {
            axios.get('http://localhost:3000/api/users/'+id)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setUser(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        getUser()
    },[id])

    if(errorFlag) {
        return (
            <div>
                <h1>User</h1>
                <div style={{color:"red"}}>
                    {errorMessage}
                </div>
                <Link to={"/users"}>Back to users</Link>
            </div>
        )
    } else {
        return (
            <div>
                <h1>User</h1>
                {user.user_id}: {user.username}
                <Link to={"/users"}>Back to users</Link>
                <Button variant="outlined" endIcon={<EditIcon />} onClick={() => { handleEditDialogOpen(user)
                }}>
                    Edit
                </Button>
                <Dialog
                    open={openEditDialog}
                    onClose={handleEditDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        {`Renaming "${user.username}" to:`}
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
                            editUser(user);
                        }} autoFocus>
                            Save changes
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    autoHideDuration={6000}
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
                <Button variant="outlined" endIcon={<DeleteIcon />} onClick={() => { handleDeleteDialogOpen(user)
                }}>
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
                            deleteUser(user);
                        }} autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
export default User;