import React, { useRef, useState, useContext } from 'react'
import JoditEditor from 'jodit-react'
import '../styling/TextEditor.css'
import icon4 from '../icons/icon4.png'
import axios from "axios"
import IsLoggedInContext from '../contexts/IsLoggedInContext'
import { useUser } from '../contexts/UserContext'
//jhjhj
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//jhjklk

function TextEditor(props) {
    const editor = useRef(null);
    const [value, setValue] = useState("");
    const { user, setUser } = useUser();
    const loginContext = useContext(IsLoggedInContext);
    const [title, setTitle] = useState(props.title);
    const post = props.post;

    const onSubmit = async event => {
        event.preventDefault();
        // const sens = ["kutta hai tu", "kutti hai tu", "nikal kanjar", "kaminay ho ap", "bc ho tum"];
        let content = value;

        if (props.type =="comment"? !value : !title || !value) {
            toast.error(' Enter data to be posted', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }

        else {
            const user_id = user.id;
            
            if (props.type =="comment") {
                try {
                    let post_id = post.id;
                    await axios.post('http://localhost:5000/add_comment', {
                        content,
                        post_id,
                        user_id
                    });
                    toast.success(' Your comment was made!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });                   
                    props.setTrigger(false);
                    setTitle("");
                    setValue("");
                } catch (e) {
                    console.log(e);
                }
            }

            else if(props.type =="post") {         
                let e = document.getElementById("categ");
                let categ = e.options[e.selectedIndex].text
                try {
                    await axios.post('http://localhost:5000/add_post', {
                        content,
                        user_id,
                        title,
                        categ
                    });
                    toast.success(' Your post was made!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    let total = user.total_posts + 1
                    props.setTrigger(false);
                    setUser({
                        ...user,
                        total_posts: total
                    })
                    props.setChanges(props.changes+1)
                    setTitle("");
                    setValue("");
                } catch (e) {
                    console.log(e.response.data.message);
                }
            }

        }

    }



    return (
        props.trigger &&
        <div className='EditorBox'>
            <div className='CloseBtn' onClick={() => { props.setTrigger(false) }}>&times;</div>
            <div className="postUserImg">
                <img src={user.uimg ? ("data:image/jpg;base64," + user.uimg) : icon4} alt="" />
            </div>
            <div className='EditorContent'>
                <div className='categNTitle'>
                    {!post && <select name="categ" id="categ">
                        {loginContext.adminLoggedIn && <option value="categ1">Announcements</option>}
                        <option value="categ2">General</option>
                        <option value="categ3">Programming</option>
                        <option value="categ4">Sports</option>
                        <option value="categ5">Finances</option>
                        <option value="categ6">Photography</option>
                        <option value="categ7">Tutorials</option>
                        <option value="categ8">Projects</option>
                    </select>}
                    {post ? <input type='text' placeholder='Post title' value={post.title} disabled className='editorTitleBox' /> : <input type='text' placeholder='Post title' className='editorTitleBox'
                        value={title}
                        onChange={e => setTitle(e.target.value)} />}
                </div>
                <div className='joditBox'>
                    <JoditEditor ref={editor}  onChange={(content) => setValue(content)} />
                    {/* config={props.config} */}
                </div>

                <div className='postBtn' onClick={onSubmit}><button className='Btn'><i className="far fa-paper-plane"></i>Post</button></div>
            </div>
        </div>
    )
}

export default TextEditor