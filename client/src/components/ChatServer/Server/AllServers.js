import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import defaultGroupImage from '../../../images/Snapchat-744599346 (2).jpg'
import './style.css'
import * as api from '../../../api'

const AllServers = () => {
    const [allServers, setAllServers] = useState([])
    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await api.fetchAllServers();
                console.log(data);
                setAllServers(data.allServers);
                console.log("got My servers");
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchData();
    }, []);
    return (
        <div>
            {allServers.map((server, i) => <div key={i} className="server_list_container">
                <img src={server.dp ? server.dp : defaultGroupImage} alt={server.uniqueName} />
                <Link to={`/chatServers/server/${server._id}`}><div className="name_serverlist">
                    <p>{server.uniqueName}</p>
                    <p>By - {(server.ownerStudent ? server.ownerStudent.username : null) || server.ownerTeacher.username}</p>
                    <p>({server.category})</p>
                    <p>{server.for}</p>
                </div></Link>
            </div >)
            }
        </div>
    )
}
export default AllServers;