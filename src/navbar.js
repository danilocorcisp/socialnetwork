import React from "react";

class Navbar extends React.Component {
    render() {
        return (
            <div className="footer">
                <div className="nav">
                    <ul id="menu">
                        <li>
                            <a href="/">My profile</a>
                        </li>
                        <li>
                            <a href="/friends">My friends</a>
                        </li>
                        <li>
                            <a href="/users">Find users</a>
                        </li>
                        <li>
                            <a href="/chat">Chat room</a>
                        </li>
                        <li>
                            <a href="/logout">Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Navbar;

//fim
