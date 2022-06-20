import React from "react";
import { Link, useNavigate } from "react-router-dom";
import defaultGroupImage from '../../../../images//Snapchat-744599346 (2).jpg'
import defaultUserImage from '../../../../images/Snapchat-744599346 (2).jpg'
import './styleinfobar.css'
const InfoBar = ({ serverDetails }) => {
    //const ka dont know
    // const history = useNavigate();
    return (
        <div className="info_bar_container">
            <div className="infobar_in">
                <img src={serverDetails.dp ? serverDetails.dp : defaultUserImage} alt={serverDetails.uniqueName} width='200' />
                <span className="info_a">{serverDetails.uniqueName}</span>
                <p style={{float:'right'}}>({serverDetails.for})</p>
            </div>
            {/* <button onClick={() => history.goBack()}>Back</button> */}
        </div>
    )
};

export default InfoBar;