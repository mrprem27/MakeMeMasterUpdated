import React from "react";


import Message from './Message/Message'

const Messages = ({ messages, self, typing, }) => {
    return (
        <>
            {messages && messages.map((message, index) => <Message message={message} self={self} key={index} />)}
            <div className="typing_cover">
                {typing && <p className="chat_typing">Typing...</p>}
            </div>
        </>
    );
}

export default Messages;