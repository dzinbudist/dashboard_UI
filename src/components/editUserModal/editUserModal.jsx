import React, {Component, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import store from "../../js/store";
import DeleteUser from "../deleteUser/deleteUser";
import './editUserModal.scss';

function EditUserModal(props) {

    return (
        <div>
            <EditUser
                user={props.user}
                changeUserList={props.changeUserList}
                endpoint={props.endpoint}/>
        </div>
    );
}

function EditUser(props) {

    const [show, setShow] = useState(false);
    const [response, setResponse] = useState(); //response from server

    const handleClose = () => {
        setShow(false);
        setPasswordsMatch(true) //after we close and re-enter Modal to have password state reset to default.
    };
    const handleShow = () => {
        setShow(true);
        setResponse();
    }

    //check if passwords match
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const checkPasswordMatch = function check(){
        setPasswordsMatch(document.getElementById("confirmPassword").value == document.getElementById("password").value)
    }


    return (
        <>
            <a className="btn btn-link btn-sm txt" variant="primary" onClick={handleShow}>
                <i className="material-icons iconHover">&#xe254;</i>
            </a>
            <Modal show={show} onHide={handleClose} className="UserModal">
                <div className="forma">
                    <form className="login-form" onSubmit={handleSubmit} id="formForPost" noValidate>
                        <div className="form-group"/>
                        <input type="text" placeholder="Username" defaultValue={props.user.username} name="userName" required/>
                        <input type="text" placeholder="First Name" defaultValue={props.user.firstName} name="firstName" required/>
                        <input type="text" placeholder="Last Name" defaultValue={props.user.lastName} name="lastName" required/>
                        <input type="email" placeholder="Email" defaultValue={props.user.userEmail} name="userEmail" required/>
                        {
                        props.user.role == "Admin" ? 
                        <select name="role" className="SelectFrom" required>
                            <option value="User">User</option>
                            <option value="Admin" selected={true}>Admin</option>
                        </select>
                        :
                        <select name="role" className="SelectFrom" required>
                            <option value="User" selected={true}>User</option>
                            <option value="Admin">Admin</option>
                        </select>
                        }   
                        {/* Backendas neatsiuncia passwordo */}
                        <input id="password" type="password" placeholder="Password" name="password" onChange={checkPasswordMatch} pattern="^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[\W_])\S{10,128}$" title="Mininum 10 chars and: atleast one uppercase, lowercase, special character and a number" required/> 
                        <input id="confirmPassword" type="password" placeholder="Confirm Password" name="confirmPassword" onChange={checkPasswordMatch} required/>
                        {passwordsMatch ? "":"Passwords don't match"}
                        <hr/>
                        <br/>
                        <button type="submit" value="send POST">Update</button>
                        <button onClick={handleClose} type="button">Cancel</button>
                        <div>{response}</div>
                        <DeleteUser
                        user={props.user}
                        changeUserList={props.changeUserList}
                        endpoint={props.endpoint}/>
                    </form>
                </div>
            </Modal>
        </>
    );

    function handleSubmit(event) {
        var dataForSending = {
            username: event.target.userName.value,
            firstName: event.target.firstName.value,
            lastName: event.target.lastName.value,
            userEmail: event.target.userEmail.value,
            password: event.target.password.value,
            confirmPassword: event.target.confirmPassword.value,
            role: event.target.role.value  
        };
        console.log("full object for sending:", dataForSending);
        console.log("JSON string:", JSON.stringify(dataForSending));
        console.log("domain obj: ", props.user);
        submitData(props.endpoint, props.changeUserList, dataForSending);
        event.preventDefault();
    }

    async function fetchPut(endpoint, dataForSending) {
        const response = await fetch(endpoint,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + store.getState().token
                },
                body: JSON.stringify(dataForSending) // body data type must match "Content-Type" header
            }
        );
        const data = response;
        return data;
    }
console.log(props.user.id)
    function submitData(endpoint, changeUserList, dataForSending) {
        fetchPut(endpoint + "users/" + props.user.id, dataForSending)
            .then((response) => {
                console.log("status code " + response + "...");
                if (response.status > 199 && response.status < 300) {
                    setResponse("User updated")

                    const editedUser = Object.assign({...props.user}, dataForSending);
                    changeUserList(editedUser)
                    handleClose();
                }
                else {
                    let duomenys = response.json()
                    .then((duomenys) => {
                        setResponse(duomenys.message)
                    })
                }
            })
            .catch((error) => {
                console.error("FETCH ERROR: ", error);
            });
    }
}

export default EditUserModal;