import React from "react";
import Name from "./Name";

export default class HelloWorld extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "ivana",
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        // componentDidMount is the React equivalent of Vue's mounted method
        // this.setState is how we update state
        this.setState(
            {
                first: "vanilla",
            },
            () => console.log("this.state: ", this.state)
        );
    }

    handleClick() {
        this.setState({
            first: "ziggy",
        });
    }

    // "cannot read property setState of undefined"
    // solution 1.) onClick = { () => this.handleClick() }
    // solution 2.) in constructor: this.handleClick = this.handleClick.bind(this);

    render() {
        return (
            <div className="container">
                <h1>Hi, {this.state.first}</h1>
                <p onClick={this.handleClick}>I'm a p tag!</p>
                <Name first={this.state.first} />
            </div>
        );
    }
}

// function HelloWorld() {
//     // JSX is JS that looks like HTML
//     return <div>Hello, World!</div>;
// }