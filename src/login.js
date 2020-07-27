import React, { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

class Login extends Component {
    constructor(props) {
        console.log("Login -> constructor -> props", props);
        super(props);
        this.state = {};
    }

    handleChange(e) {
        console.log(e.target.value);
        console.log(e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log(this.state)
        );
    }

    submit(e) {
        e.preventDefault();
        axios
            .post("/login", this.state)
            .then((resp) => {
                console.log("Login -> submit -> data", resp);

                if (resp.data.success) {
                    console.log(
                        "Login -> submit -> data.success",
                        resp.data.success
                    );
                    location.replace("/");
                } else {
                    this.setState({ error: true });
                }
            })
            .catch((err) => console.log(err));
    }
    render() {
        return (
            <div className="login">
                <div className="container-login">
                    {this.state.error && (
                        <div>Something went wrong. Please try again.</div>
                    )}
                    <div className="wrap-login">
                        <form className="login-form">
                            <span className="login-form-title">Login</span>
                            <input
                                className="input"
                                required
                                name="email"
                                type="email"
                                placeholder="Email"
                                onChange={(e) => this.handleChange(e)}
                            />
                            <span className="focus-input"></span>
                            <input
                                className="input"
                                required
                                name="password"
                                type="password"
                                placeholder="Password"
                                onChange={(e) => this.handleChange(e)}
                            />
                            <span className="focus-input"></span>
                            <div className="container-login-form-btn">
                                <button
                                    className="login-form-btn"
                                    onClick={(e) => this.submit(e)}
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                        <div className="flex-col-c">
                            <p>
                                <Link to="/reset">Change your password</Link>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;

//fim
