import axios from 'axios'
import React from 'react'
import '../styling/AdminPanel.css'
import UserCard from './UserCard'
import { useState, useEffect } from 'react'

function AllUsers() {

    const [users, setUsers] = useState([])

    const getUsers = async () => {
        const res = await axios.get('http://127.0.0.1:5000/get_users');
        let { data } = res.data;
        setUsers(res.data);
    };
    useEffect(() => {
        getUsers();
    }, [])

    return (
        <>
            <h2>Registered Users ({users.length}) </h2>
            <div className='AllUsers'>
                {users.map(user => {
                    return (
                        <div className='userCard' key={user.id}>
                        <UserCard user={user}/>
                        </div>)
                })}

            </div>
        </>
    )
}

export default AllUsers