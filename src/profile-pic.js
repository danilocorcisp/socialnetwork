import React from "react";

function ProfilePic({ image, toggleModal }) {
    image = image || "/img/start.jpg";
    return (
        <div className="profile-img-container">
            <img className="profile-img" src={image} onClick={toggleModal} />
        </div>
    );
}

export default ProfilePic;

//fim
