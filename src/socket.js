import * as io from "socket.io-client";
import { sendMessages, sendNewMessage } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("10 last messages", (messages) => {
            store.dispatch(sendMessages(messages));
            console.log("init -> messages", messages);
        });

        socket.on("chat message", (message) => {
            store.dispatch(sendNewMessage(message));
            console.log("init send message -> message", message);
        });
    }
};
