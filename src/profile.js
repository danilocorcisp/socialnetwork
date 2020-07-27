import React from "react";
import Uploader from "./uploader";
import ProfilePic from "./profile-pic";
import BioEditor from "./bio-editor";

export default function Profile(props) {
    return (
        <div className="profile">
            <h1>
                Hi there {props.first} {props.last}
            </h1>
            <div className="bigpic">
                <ProfilePic
                    image={props.image}
                    toggleModal={() => props.toggleModal()}
                />
                {/* {props.uploaderIsVisible && (
                <Uploader
                    updatePic={(image) => props.updatePic(image)}
                    toggleModal={() => props.toggleModal()}
                    // image={props.state.image}
                />
            )} */}
            </div>

            <div className="bio">
                <BioEditor
                    bio={props.bio}
                    changeBio={(bio) => props.changeBio(bio)}
                    showBio={(bio) => props.showBio(bio)}
                />
            </div>
        </div>
    );
}

//fim
