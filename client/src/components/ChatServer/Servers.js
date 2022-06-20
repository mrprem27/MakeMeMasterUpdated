import React, { useState, useEffect } from "react";
import { Navigate, useParams, useNavigate} from "react-router-dom";
import './styleServers.css'
import AllServers from "./Server/AllServers";
import SubscribedServers from './Server/SubscribedServers'
import { useGlobalContext } from "../../context/App";
import MyServers from './Server/MyServers'

const Server = () => {
    const { id } = useParams();
    let navigate = useNavigate();
    const { isLogined } = useGlobalContext()
    const [state, setState] = useState(id)
    return (
        !isLogined ? <Navigate to={`/`} />
            : <section  >
                <div className='task-list-top'>
                    <div >
                        <h3 className={state == 0 ? 'active-btn' : null} onClick={() => {
                            setState(0)
                            navigate('/chatServers/0')
                        }}>Subscribed Servers</h3>
                        <h3 className={state == 1 ? 'active-btn' : null} onClick={() => {
                            setState(1)
                            navigate('/chatServers/1')
                        }}> My Servers </h3>
                        <h3 className={state == 2 ? 'active-btn' : null} onClick={() => {
                            setState(2)
                            navigate('/chatServers/2')
                        }}> All Servers </h3>
                    </div>
                    {state == 0 && <h2>Subscribed Servers</h2>}
                    {state == 1 && <h2>My Servers</h2>}
                    {state == 2 && <h2>All Servers</h2>}
                </div>
                {state == 0 && <SubscribedServers />}
                {state == 1 && <MyServers />}
                {state == 2 && <AllServers />}
            </section>)
}
export default Server;