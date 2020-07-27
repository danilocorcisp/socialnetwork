import React from "react";
import axios from "./axios";
// import { Link } from "react-router-dom";

class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            typing: false,
            rascunho: this.props.bio,
        };
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    toggleEdit() {
        this.setState({
            typing: !this.state.typing,
        });
    }
    async modifyBio(e) {
        e.preventDefault();

        try {
            const { data } = await axios.post("/update-bio", this.state);

            this.props.showBio(data.bio);
            this.toggleEdit();
        } catch (err) {
            console.log(err);
        }
    }
    getCurrentDisplay() {
        if (this.state.typing) {
            return (
                <div className="edicao">
                    <h3>About Me</h3>
                    <form className="form">
                        <textarea
                            id="bio"
                            name="rascunho"
                            rows="10"
                            cols="35"
                            onChange={(e) => this.handleChange(e)}
                            defaultValue={this.props.bio}
                        ></textarea>
                        <span className="focus-input"></span>
                        <div className="container-edicao-form-btn">
                            <button
                                className="edicao-form-btn"
                                onClick={(e) => this.modifyBio(e)}
                            >
                                SAVE
                            </button>
                        </div>
                    </form>
                </div>
            );
        } else if (!this.props.bio) {
            return (
                <div className="bio-editor">
                    <p className="edicao" onClick={() => this.toggleEdit()}>
                        About me. Click to add something.
                    </p>
                </div>
            );
        } else {
            return (
                <div className="bio-editor">
                    <h3>About me</h3>
                    <p className="edicao">{this.props.bio}</p>
                    <p
                        className="edicao-botao"
                        onClick={() => this.toggleEdit()}
                    >
                        Edit
                    </p>
                </div>
            );
        }
    }
    render() {
        return <>{this.getCurrentDisplay()}</>;
    }
}

export default BioEditor;

//fim
