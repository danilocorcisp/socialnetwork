export default function reducer(state = {}, action) {
    if (action.type == "GET_FRIENDS") {
        return (state = { ...state, friends: action.friends });
    }

    if (action.type == "ACCEPT_REQUEST") {
        return (state = {
            ...state,
            friends: state.friends.map((friend) => {
                if (friend.id != action.id) {
                    return friend;
                } else {
                    return {
                        ...friend,
                        accepted: true,
                    };
                }
            }),
        });
    }

    if (action.type == "DELETE") {
        return (state = {
            ...state,
            friends: state.friends.filter((friend) => friend.id != action.id),
        });
    }

    if (action.type == "LAST_MESSAGES") {
        return (state = {
            ...state,
            messages: action.messages,
        });
    }

    console.log("state LAST_MESSAGES:", state);

    if (action.type == "CHAT_MESSAGE") {
        return (state = {
            ...state,
            messages: [...state.messages, action.message],
        });
    }

    console.log("state after CHAT_MESSAGE:", state);

    return state;
}

//fim

// ... (spread operator)
// - useful for making clines of objects anda arrays
// we can add new properties/element to these cloned objects and arrays

// var obj = {
//     name: "danilo",
// };

// var newObj = {
//     ...obj,
//     last: "corci",
// };

// var arr = [10, 20, 30];
// var newArr = [0, ...arr, 40];

// useful array methods

// map - useful for cloning an array. Changing each element in the array andfinda one specific element(s) in an array
// anda changing just that specific thing(s)
// map is a loop that by default returns a brand new array

// filter - useful for removing things from an array
//filter is a loop that by default returns a brand new array

//concat - useful for merging 2 arrays together
//concat is not a loop, but it still does by default return a new array
//you can also merge two arrays together using the sprad operator
