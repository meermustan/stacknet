import React from 'react'
import '../styling/UserCard.css'
import icon4 from '../icons/icon4.png'
import { toast } from 'react-toastify';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';

function UserCard(props) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const { user } = useUser();


  const removeUser = async (id) => {

    if (id === user.id) {
      toast.error('Cannot removed yourself!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    else {

      if (window.confirm("Are you sure you want to remove this user?") === true) {
        try {
          await axios.delete(`/admin/delete_user/${id}/`)

          toast.success('User removed successfully!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          window.location.reload(false);
        } catch (error) {
          alert(error)
        }
      }
    }
  }

  return (
    <>
      <div className='userCardImg'>
        <img src={props.user.uimg ? "data:image/jpg;base64," + props.user.uimg : icon4} alt="" />
      </div>
      <div className='cardContent'>
        <h3 className='userName'>{props.user.fullname}</h3>
        <p>{props.user.email}</p>
        <p>Joined: {new Date(props.user.date_joined).getDate()} {monthNames[new Date(props.user.date_joined).getMonth()]}, {new Date(props.user.date_joined).getFullYear()}</p>
        <p>Gender: {props.user.gender}</p>
        <p>Posts: {props.user.total_posts ? props.user.total_posts : 0}</p>
        <button onClick={() => removeUser(props.user.id)}>Remove</button>
      </div>
    </>
  )
}

export default UserCard
