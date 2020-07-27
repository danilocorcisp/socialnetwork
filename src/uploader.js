import React from "react";
import axios from "./axios";

class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log("UPLOADER MOUNTED");
    }

    async handleChange(e) {
        e.preventDefault();

        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        try {
            const { data } = await axios.post("/upload-img", formData);
            console.log("data test: ", data);

            this.props.updatePic(data[0].image);
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <div className="uploader">
                <div className="modal">
                    <p className="close" onClick={this.props.toggleModal}>
                        X
                    </p>
                    {/* <h2>Want to change your profile picture?</h2> */}
                    <form>
                        <input
                            name="file"
                            id="file"
                            type="file"
                            accept="image/*"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <label for="file">
                            <i className="material-icons">
                                add_photo_alternate
                            </i>{" "}
                            &nbsp; Choose a Photo
                        </label>
                    </form>
                </div>
            </div>
        );
    }
}

export default Uploader;

//fim
