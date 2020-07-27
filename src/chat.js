import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chat() {
    const elemRef = useRef();
    const messages = useSelector((state) => state && state.messages);
    console.log("Chat -> messages", messages);
    // this will be undefined for you right now!!
    // console.log('here are my last 10 chat messages: ', chatMessages);

    // you'll want to run this everytime we get a newChatMsg - you need to pass something to the array
    useEffect(() => {
        // console.log('chat hooks component has mounted');
        // console.log('elementRef = ', elemRef);
        // console.log('scroll Top: ', elemRef.current.scrollTop);
        // console.log('clientHeight: ', elemRef.current.clientHeight);
        // console.log('scrollHeight: ', elemRef.current.scrollHeight);

        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [messages]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // this will prevent going to the next line
            socket.emit("chatMessage", e.target.value);
            e.target.value = ""; // clears input field after we click enter
        }
    };

    return (
        <div className="chat">
            <h3>CHAT ROOM</h3>
            <div className="msg-container" ref={elemRef}>
                {messages &&
                    messages.map((message) => {
                        return (
                            <div className="mensagens" key={message.id}>
                                <div className="img-container">
                                    <img
                                        className="profile-img"
                                        src={message.image}
                                    />
                                </div>
                                <div className="msg-text">
                                    <p>
                                        <span className="username">
                                            {message.first} {message.last}
                                        </span>{" "}
                                        <span className="date">
                                            {message.created_at}
                                        </span>
                                    </p>
                                    <p>{message.text_message}</p>
                                </div>
                            </div>
                        );
                    })}
            </div>
            <textarea
                placeholder="Type and press ENTER to chat"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
}
