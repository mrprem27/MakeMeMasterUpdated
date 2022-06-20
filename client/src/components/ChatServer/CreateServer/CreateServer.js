import React, { useState, useRef } from "react";
import { Navigate } from 'react-router-dom';
import * as api from '../../../api'
// import './styleServer_create.css';
import categories from "../../Mycourses/CreateMyCourse/categories";
import { useGlobalContext } from './../../../context/App'

const CreateServer = ({ setWantToCreateServer, setMyServers }) => {
    const { viewModal, isLogined } = useGlobalContext();
    const uniqueName = useRef(null)
    const category = useRef(null)
    const forString = useRef(null);
    const [tagsArray, setTagsArray] = useState([])
    const [tag, setTag] = useState('')
    const submitHandler = async (e) => {
        e.preventDefault();
        const dataServer = {
            uniqueName: uniqueName.current.value,
            category: category.current.value,
            for: forString.current.value,
            tags: tagsArray
        }
        try {
            console.log(dataServer);
            const { data } = await api.createServer(dataServer);
            viewModal('Server Created Succesfully!!');
            setMyServers((x) => [...x, dataServer])
            setWantToCreateServer(false)
        } catch (error) {
            viewModal(error.message)
            console.log(error.message);
        }
    };
    const delTag = (e) => {
        const delnode = e.target.parentNode.innerText.slice(4);
        setTagsArray(tagsArray.filter((obj) => delnode !== obj));
    }
    return (
        <div>
            {!isLogined && <Navigate to={`/`} />}
            <button onClick={() => setWantToCreateServer(false)}>cancel</button>
            <form onSubmit={submitHandler}>
                <input type="text" ref={uniqueName} />
                <input type="text" ref={forString} />
                <select ref={category} >
                    <option value="">--Choose Category--</option>
                    {categories.map((c, i) => <option value={c} key={i}>{c}</option>)}
                </select>
                <div>
                    <ul>
                        {tagsArray && tagsArray.map((o, i) =>
                            <li key={i}><button onClick={delTag}>DEL</button> {o}</li>
                        )}
                    </ul>
                    {tagsArray.length < 10 ? <div>
                        <textarea cols="30" rows="10" onChange={(e) => setTag(e.target.value)} value={tag}></textarea>
                        <button onClick={(e) => {
                            e.preventDefault();
                            if (tag.length < 100 && tag.length > 3) {
                                setTagsArray([...tagsArray, tag.trim()]);
                                setTag('');
                            } else {
                                viewModal("tag's length should be less than 100 and greater than 2 charaters ")
                            }
                        }}>ADD to Tag</button>
                    </div> : <div>Can't add more than 10 tags in a Server</div>}
                </div>
                <input type="submit" value="Create Server" />
            </form>
        </div>
    )
}
export default CreateServer;