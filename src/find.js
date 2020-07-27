import React, { useEffect, useState } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

const FindPeople = () => {
    const [users, setUsers] = useState([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        (async () => {
            const { data } = await axios.get("/new-users.json");
            setUsers(data);
        })();
    }, []);

    const handleChange = async (e) => {
        setSearching(true);
        if (e.target.value) {
            let query = e.target.value;
            const { data } = await axios.get("/users/" + query + ".json");
            // console.log("query: ", query);
            // console.log("data: ", data);
            setUsers(data);
        } else {
            setSearching(false);
            const { data } = await axios.get("/new-users.json");
            setUsers(data);
        }
    };

    return (
        <div className="find-users">
            <div className="input">
                <input
                    type="text"
                    onChange={handleChange}
                    placeholder="Search for a member"
                ></input>
            </div>

            {!searching && <h3>NEW MEMBERS</h3>}
            {users.map((user, index) => {
                return (
                    <div key={index} className="list-users">
                        <Link to={`/user/${user.id}`}>
                            <div className="users-container">
                                <img
                                    className="profile-pic"
                                    alt={`${user.first} ${user.last}`}
                                    src={user.image || "/default.svg"}
                                />
                            </div>
                        </Link>
                        <div className="users-bio">
                            <Link className="username" to={`/user/${user.id}`}>
                                <h3>
                                    {user.first} {user.last}
                                </h3>
                            </Link>
                            <div className="bio-text">
                                <p>{user.bio}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FindPeople;

//fim
