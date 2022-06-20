import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import * as api from "../../../api";
import Loader from '../../Loader/Loader'
import ScrollToBottom from 'react-scroll-to-bottom';
import InfoBar from './InfoBar/InfoBar'
import Messages from './Messages/Messages'
import { useParams, Navigate } from "react-router-dom";
import './styleChat.css'
import { useGlobalContext } from "../../../context/App";

let socket;

const Chat = () => {
    const [self, setSelf] = useState(null);
    const [messages, setMessages] = useState([]);
    const ENDPOINT = "localhost:5000";
    const [message, setMessage] = useState('')
    const { id } = useParams();
    const messageBox = useRef(null);
    const [navToSub, setNavToSub] = useState(false)
    const { isLogined, viewModal } = useGlobalContext()
    const [typing, setTyping] = useState(false);
    const [serverDetails, setServerDetails] = useState({})
    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.viewServer(id);
                console.log(data);
                if (data.isValid == false) {
                    const tempId = data.server._id;
                    if (window.confirm('Do you wanna join "'+data.server.uniqueName+'" chat Server?')) {
                        try {
                            const { data } = await api.addMeToServer(tempId);
                            console.log(data);
                            if (data.server.chats) setMessages(data.server.chats);
                            setSelf(data.self)
                            setServerDetails({ ...(data.server), chats: [] });
                            try {
                                socket = io(ENDPOINT, { transports: ["websocket"] });
                                socket.emit('join server', { name: data.self.username, room: data.server._id }, (error) => {
                                    if (error) {
                                        console.log("already joined!!");
                                    }
                                });
                                socket.on('message', newMessage => {
                                    if (newMessage) {
                                        setMessages(messages => [...messages, newMessage]);
                                    }
                                });
                                socket.on('setTyping', () => {
                                    setTyping(true);
                                });
                                socket.on('setNotTyping', () => {
                                    setTyping(false);
                                });
                            } catch (error) {
                                console.log(error.message);
                            }
                            if (messageBox.current) messageBox.current.focus()
                        } catch (error) {
                            setNavToSub(true)
                            viewModal(error.message)
                            console.log(error.message);
                        }
                    }
                    else {
                        setNavToSub(true)
                    }
                } else {
                    if (data.server.chats) setMessages(data.server.chats);
                    setSelf(data.self)
                    setServerDetails({ ...(data.server), chats: [] });

                    try {
                        socket = io(ENDPOINT, { transports: ["websocket"] });
                        socket.emit('join server', { name: data.self.username, room: data.server._id }, (error) => {
                            if (error) {
                                console.log("already joined!!");
                            }
                        });
                        socket.on('message', newMessage => {
                            if (newMessage) {
                                setMessages(messages => [...messages, newMessage]);
                            }
                        });
                        socket.on('setTyping', () => {
                            setTyping(true);
                        });
                        socket.on('setNotTyping', () => {
                            setTyping(false);
                        });
                    } catch (error) {
                        console.log(error.message);
                    }
                    if (messageBox.current) messageBox.current.focus()
                }
            } catch (error) {
                console.log(error.message);
            }
        })();
        return () => {
            if (socket) {
                console.log("Shit");
                socket.emit("dis");
                socket.off();
            }
        };
    }, [id]);

    useEffect(() => {
        if (socket) {
            if (message) {
                socket.emit('typing', {}, (error) => {
                    if (error) {
                        console.log("error typing");
                    }
                });
            }
            let t = window.setTimeout(() => {
                socket.emit('notTyping', {}, (error) => {
                    if (error) {
                        console.log("error typing");
                    }
                });
            }, 700);
            return () => {
                clearTimeout(t);
            }
        }
    }, [message])

    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            const sendMessage = {
                sender: self._id,
                type: 'normal',
                sendername: self.username,
                sender: self._id,
                message: message,
            }
            setMessage('');
            setMessages([...messages, sendMessage]);
            socket.emit('sendMessage', sendMessage, () => {
                messageBox.current.focus()
            });
        }
        else {
            viewModal("Enter Message");
        }
    }

    return (
        <div className="chat_container">
            {navToSub && <Navigate to={`/chatServers/0`} />}
            {!isLogined && <Navigate to={`/`} />}
            {self && <section className="chat_section">
                <div className="chat_infobar2">
                    <InfoBar serverDetails={serverDetails} />
                </div>
                <ScrollToBottom className="chat_messages_total">
                    <Messages className="chat_messages" messages={messages} self={self} typing={typing} />
                </ScrollToBottom>
                <form onSubmit={(e) => sendMessage(e)}>
                    <input
                        type="text"
                        id="message_input"
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        ref={messageBox}
                        placeholder="Type Your Message"
                    />
                    <button type="submit">Send</button>
                </form>
            </section>}
        </div>
    );
};
export default Chat;
