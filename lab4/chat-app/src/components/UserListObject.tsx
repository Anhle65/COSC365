import React from "react";

interface IUserProps {
    user: User
}
const UserListObject = (props: IUserProps) => {
    const [user] = React.useState<User> (props.user);
    return(
        <h3>User {user.username}</h3>
    )
}
export default UserListObject