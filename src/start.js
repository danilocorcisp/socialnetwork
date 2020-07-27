import React from "react";
import ReactDOM from "react-dom";
import Logo from "./firstpage";
import Welcome from "./welcome";
import App from "./app";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";
import * as io from "socket.io-client";
import { init } from "./socket";

io.connect();

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

// elem =

let elem;
const userIsLoggedIn = location.pathname != "/welcome";
console.log("userIsLoggedIn", userIsLoggedIn);

if (!userIsLoggedIn) {
    elem = <Welcome />;
} else {
    init(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

//fim

ReactDOM.render(elem, document.querySelector("main"));

//fim n
