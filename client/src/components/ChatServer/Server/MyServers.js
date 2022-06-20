import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import defaultGroupImage from '../../../images/Snapchat-744599346 (2).jpg'
import './style.css'
import * as api from '../../../api'
import CreateServer from './../CreateServer/CreateServer'
const MyServers = () => {
    const [wantToCreateServer, setWantToCreateServer] = useState(false)
    const [myServers, setMyServers] = useState([])
    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await api.fetchMyServers();
                console.log(data);
                setMyServers(data.servers.myServers);
                console.log("got My servers");
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchData();
    }, []);
    return (
        <div>
            <button id="create_grp_link" onClick={() => setWantToCreateServer(true)}>Create New Server</button>
            {wantToCreateServer && <CreateServer setMyServers={setMyServers} setWantToCreateServer={setWantToCreateServer} />}
            {myServers.map((server,i) => <div key={i} className="server_list_container">
                 <img src={server.dp ? server.dp : defaultGroupImage} alt={server.uniqueName} />
                <Link to={`/chatServers/server/${server._id}`}><div className="name_serverlist">
                    <p>{server.uniqueName}</p>
                    <p>({server.category})</p>
                    <p>{server.for}</p>
                </div></Link>
            </div >)
            }
        </div>
    )
}
export default MyServers;