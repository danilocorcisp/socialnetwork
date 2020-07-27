import React from "react";

class Logo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                {/* <h1 className="title">Welcome to Timão Network!</h1> */}
                <img
                    className="logo"
                    src="/img/logo.jpg"
                    alt="Corinthians meu amor"
                />
            </>
        );
    }
}

export default Logo;

//fim
