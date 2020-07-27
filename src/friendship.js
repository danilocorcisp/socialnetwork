import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { friendRelation, acceptFriendRequest, deleteFriend } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(friendRelation());
    }, []);

    const realFriends =
        useSelector(
            (state) =>
                state.friends &&
                state.friends.filter((friend) => friend.accepted)
        ) || [];
    const wannabeFriends =
        useSelector(
            (state) =>
                state.friends &&
                state.friends.filter((friend) => !friend.accepted)
        ) || [];

    return (
        <div className="find-friends">
            <div className="wannabe-friends">
                <h3>Requests</h3>
                <div className="profiles">
                    {wannabeFriends.map((user) => (
                        <div className="users-container" key={user.id}>
                            <Link to={`/user/${user.id}`}>
                                <div className="friend-container">
                                    <img
                                        src={user.image}
                                        alt={`${user.first} ${user.last}`}
                                    />
                                </div>
                            </Link>
                            <div className="friend-data">
                                <Link className="user" to={`/user/${user.id}`}>
                                    <h4>
                                        {user.first} {user.last}
                                    </h4>
                                </Link>
                                <p>
                                    <span
                                        className="details"
                                        onClick={() =>
                                            dispatch(
                                                acceptFriendRequest(user.id)
                                            )
                                        }
                                    >
                                        Accept
                                    </span>{" "}
                                    /{" "}
                                    <span
                                        className="details"
                                        onClick={() =>
                                            dispatch(deleteFriend(user.id))
                                        }
                                    >
                                        No way
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="friendsContainer">
                <h3>Friends</h3>
                <div className="profiles">
                    {realFriends.map((user) => (
                        <div className="users-container" key={user.id}>
                            <Link to={`/user/${user.id}`}>
                                <div className="friend-container">
                                    <img
                                        src={user.image}
                                        alt={`${user.first} ${user.last}`}
                                    />
                                </div>
                            </Link>
                            <div className="friend-data">
                                <Link className="user" to={`/user/${user.id}`}>
                                    <h4>
                                        {user.first} {user.last}
                                    </h4>
                                </Link>
                                <p
                                    className="details"
                                    onClick={() =>
                                        dispatch(deleteFriend(user.id))
                                    }
                                >
                                    Kill the friendship
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
