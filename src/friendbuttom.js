import React, { useEffect, useState } from "react";
import axios from "./axios";

export default function FriendButton(props) {
    const [buttonText, setButtonText] = useState("");
    const label = {
        send: "Send friend request",
        accept: "Accept friend request",
        cancel: "Cancel friend request",
        end: "End friendship",
    };

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(
                    `/friends-relation/${props.id}`
                );
                console.log("data do botao: ", props.id);
                if (data.length < 1) {
                    setButtonText(label.send);
                } else if (data[0].accepted) {
                    setButtonText(label.end);
                } else if (data[0].receiver_id == props.id) {
                    setButtonText(label.cancel);
                } else if (data[0].sender_id == props.id) {
                    setButtonText(label.accept);
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            if (buttonText == label.send) {
                const success = await axios.post(
                    `/friends-request/${props.id}`
                );
                if (success) {
                    setButtonText(label.cancel);
                } else {
                    console.log(success.error);
                }
            } else if (buttonText == label.accept) {
                const success = await axios.post(
                    `/accept-friend-request/${props.id}`
                );
                if (success) {
                    setButtonText(label.end);
                } else {
                    console.log(success.error);
                }
            } else if (buttonText == label.cancel || buttonText == label.end) {
                const success = await axios.post(`/delete-friend/${props.id}`);
                if (success) {
                    setButtonText(label.send);
                } else {
                    console.log(success.error);
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="container-login-form-btn">
            <button className="edicao-form-btn" onClick={handleClick}>
                {buttonText}
            </button>
        </div>
    );
}
