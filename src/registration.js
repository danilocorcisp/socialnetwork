import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        // console.log(e.target.value);
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
            .post("/register", this.state)
            .then((resp) => {
                console.log(resp);
                if (resp.data.success) {
                    console.log(
                        "Registration -> submit -> data.success",
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
            <>
                <div className="login">
                    <div className="container-login">
                        {this.state.error && (
                            <div>Something went wrong. Please try again.</div>
                        )}

                        <div className="wrap-login">
                            <form className="login-form">
                                <span className="login-form-title">
                                    Registration
                                </span>
                                <input
                                    required
                                    name="first"
                                    type="text"
                                    placeholder="First name"
                                    onChange={(e) => this.handleChange(e)}
                                />
                                <input
                                    required
                                    name="last"
                                    type="text"
                                    placeholder="Last name"
                                    onChange={(e) => this.handleChange(e)}
                                />
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    onChange={(e) => this.handleChange(e)}
                                />
                                <input
                                    required
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    onChange={(e) => this.handleChange(e)}
                                />
                                <div className="container-login-form-btn">
                                    <button
                                        className="login-form-btn"
                                        onClick={(e) => this.submit(e)}
                                    >
                                        Register
                                    </button>
                                </div>
                            </form>
                            <div className="flex-col-c">
                                <p>
                                    <Link to="/login">Login</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Registration;
