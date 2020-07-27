import React, { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

class Reset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
        };
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    sendEmail(e) {
        e.preventDefault();
        axios
            .post("/password/change", this.state)
            .then(({ data }) => {
                if (data.success) {
                    console.log(
                        "Reset -> sendEmail -> data.success",
                        data.success
                    );
                    this.setState({ step: 2 });
                } else {
                    this.setState({ error: data.error });
                }
            })
            .catch((err) => console.log(err));
    }
    sendCode(e) {
        e.preventDefault();
        axios
            .post("/password/change/verify", this.state)
            .then(({ data }) => {
                console.log("sendCode -> data do email", data);
                if (data.success) {
                    this.setState({ step: 3 });
                } else {
                    this.setState({ error: data.error });
                }
            })
            .catch((err) => console.log(err));
    }
    getCurrentDisplay() {
        const step = this.state.step;
        if (step == 1) {
            return (
                <div className="login">
                    <div className="container-login">
                        {this.state.error && (
                            <div>Something went wrong. Please try again.</div>
                        )}
                        <div className="wrap-login">
                            <form className="login-form">
                                <span className="login-form-title">
                                    Please, use your email address used to
                                    register here and you will get an email with
                                    a secret code to change your password.
                                </span>
                                <input
                                    className="input"
                                    required
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    onChange={(e) => this.handleChange(e)}
                                />
                                <span className="focus-input"></span>
                                <div className="container-login-form-btn">
                                    <button
                                        className="login-form-btn"
                                        onClick={(e) => this.sendEmail(e)}
                                    >
                                        SEND
                                    </button>
                                </div>
                            </form>
                            <div className="flex-col-c">
                                <p>
                                    <Link to="/login">Back to Login</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (step == 2) {
            return (
                <div className="login">
                    <div className="container-login">
                        {this.state.error && (
                            <div>Something went wrong. Please try again.</div>
                        )}
                        <div className="wrap-login">
                            <form className="login-form">
                                <span className="login-form-title">
                                    The secret code was sent to your email. You
                                    have 10 minutes before the code expires.
                                </span>
                                <p>Insert the code</p>
                                <input
                                    className="input"
                                    required
                                    name="code"
                                    type="text"
                                    placeholder="Code"
                                    onChange={(e) => this.handleChange(e)}
                                />
                                <p>Please enter a new password</p>
                                <input
                                    className="input"
                                    required
                                    name="novaSenha"
                                    type="password"
                                    placeholder="New password"
                                    onChange={(e) => this.handleChange(e)}
                                />
                                <span className="focus-input"></span>
                                <div className="container-login-form-btn">
                                    <button
                                        className="login-form-btn"
                                        onClick={(e) => this.sendCode(e)}
                                    >
                                        SEND
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="login">
                    <div className="container-login">
                        <div className="wrap-login">
                            {this.state.error && (
                                <div>
                                    Something went wrong. Please try again.
                                </div>
                            )}

                            <span className="login-form-title">
                                Great job. All went well. You got a new
                                password!
                            </span>

                            <div className="flex-col-c">
                                <p>
                                    <Link to="/login">Back to Login</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
    render() {
        return <>{this.getCurrentDisplay()}</>;
    }
}

export default Reset;

//fim
