import React from "react";

export default class Name extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("ths.props: ", this.props);
        return <p>Welcome! {this.props.first} </p>;
    }
}

// export default function Name(props) {
//     // you can't change the value of a prop
//     return <p>Welcome! {props.first} </p>;
// }