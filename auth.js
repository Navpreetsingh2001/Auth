const express = require('express'); // Import the Express.js library.
const jwt = require('jsonwebtoken'); // Import the JSON Web Token (JWT) library.
const jwtPassword = '123456' // Define a secret key for signing the JWT.
const app = express(); // Create an Express.js application instance.
app.use(express.json()); // Use the built-in middleware to parse JSON requests.

const users = [ // An array of user objects representing an in-memory database.
    {
        username: "navpreet@gmail.com",
        password: "123",
        name: "Navpreet"
    },
    {
        username: "ritik@gmail.com",
        password: "12313",
        name: "Ritik"
    },
    {
        username: "mansi@gmail.com",
        password: "123131",
        name: "Mansi"
    }
];

function userExists(username, password) { // Function to check if a user exists in the users array.
    let userExists = false; // Initialize a flag to indicate if the user exists.

    for (let i = 0; i < users.length; i++) { // Loop through each user in the users array.
        if (users[i].username == username && users[i].password == password) { // Check if the username and password match.
            userExists = true; // Set the flag to true if a match is found.
        }
    }
    return userExists; // Return the flag indicating if the user exists.
}

app.post("/signin", function(req, res) { // Define a POST route for user sign-in.
    const username = req.body.username; // Extract the username from the request body.
    const password = req.body.password; // Extract the password from the request body.

    if (!userExists(username, password)) { // Check if the user does not exist.
        return res.status(403).json({ // Respond with a 403 status code and an error message.
            msg: "User doesn't exist in our in memory db"
        });
    }
    var token = jwt.sign({ username: username }, jwtPassword); // Sign a JWT with the username as payload.
    return res.json({ // Respond with the signed token.
        token,
    });
});

app.get("/users", function(req, res) { // Define a GET route for fetching users.
    const token = req.headers.authorization; // Extract the token from the Authorization header.
    
    const decoded = jwt.verify(token, jwtPassword); // Verify the token and decode the payload.
    const username = decoded.username; // Extract the username from the decoded payload.
    res.json({ // Respond with the filtered list of users.
        user: users.filter(function(value) { // Filter out the requesting user from the users array.
            if (value.username == username) {
                return false;
            } else {
                return true;
            }
        })
    });
});

app.listen(3000); // Start the Express.js server on port 3000.
