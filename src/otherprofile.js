import React from "react";
import axios from "./axios";
import FriendButton from "./friendbuttom";

class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const id = this.props.match.params.id;
        try {
            const { data } = await axios.get(`/user/${id}.json`);

            if (data.userEqualsProfile) {
                this.props.history.push("/");
            } else {
                for (const each in data) {
                    this.setState({
                        [each]: data[each],
                    });
                }
            }
        } catch (err) {
            console.log(`Error in GET "/user/${id}.json": `, err);
            this.setState({ errorLoadingUser: true });
        }
    }

    render() {
        return (
            <div className="profile">
                <FriendButton id={this.props.match.params.id} />
                <div className="bigpic">
                    <img src={this.state.image} />
                </div>
                <div className="bio">
                    <h2>
                        {this.state.first} {this.state.last}
                    </h2>
                    <div className="showbio">
                        <h4>{this.state.bio}</h4>
                    </div>
                </div>
            </div>
        );
    }
}

export default OtherProfile;
