import React from "react";
import axios from "./axios";

export async function friendRelation() {
    try {
        const friends = await axios.get("/friends-relation");
        return {
            type: "GET_FRIENDS",
            friends: friends.data,
        };
    } catch (err) {
        console.log(err);
    }
}

export async function acceptFriendRequest(id) {
    try {
        await axios.post(`/accept-friends-request/${id}`);
        return {
            type: "ACCEPT_REQUEST",
            id,
        };
    } catch (err) {
        console.log(err);
    }
}

export async function deleteFriend(id) {
    try {
        await axios.post(`/delete-friend/${id}`);
        return {
            type: "DELETE",
            id,
        };
    } catch (err) {
        console.log(err);
    }
}

export async function sendMessages(messages) {
    console.log("messages in action: ", messages);
    return {
        type: "LAST_MESSAGES",
        messages,
    };
}

export async function sendNewMessage(message) {
    console.log("sendNewMessage -> message", message);
    return {
        type: "CHAT_MESSAGE",
        message,
    };
}
