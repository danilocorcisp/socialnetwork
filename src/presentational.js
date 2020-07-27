import React from "react";

export default function Presentational({ first, last, imageUrl }) {
    console.log("Presentational -> props", props);
    imageUrl = imageUrl || "default.jpg";
    return (
        <div>
            <h2>
                This is the Presentational working and my name is {first} and my
                last is {last}
            </h2>
            <img src={imageUrl} />
        </div>
    );
}
