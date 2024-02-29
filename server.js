
/*
	Defining constants for the project <- 1/6:
		-> The `require` function is used to import modules into JavaScript
		-> We are importing the `express` module, and setting it equal to the `express` constant 
		-> The application we create will be an instance of the express module, stored in this variable 
		-> We are doing this to set a Node.js and Express.js framework for the application 

	Defining constants for the project <- 2/6:
		-> The second constant in this section imports the `cors` module, using the same `require` function as our previous import
		-> We later use the functions which this module contains, to create secure middleware for handling API requests 
		-> This module restricts the number of different webpages which can make requests to the server, for security reasons 

	Defining constants for the project <- 3/6:
		-> The third variable in this section imports the `body-parser` module
		-> This import is done with the same `require` function as our previous variable  
		-> The functions which this module contains are for `body-parser` middleware
		-> This allows the application to parse request objects from the client that have a JSON (JavaScript) object syntax
		-> This happens prior to handler execution 

	Defining constants for the project <- 4/6:
		-> The 4th constant (variable) we define in this block of code is `app`
		-> This is the name of the variable which stores the instance of the `express` project application 
		-> This initialises the application, so we can implement the methods and functions in the Express.js framework 

	Defining constants for the project <- 5/6:
		-> The 5th variable which we define in this block of code is `users`
		-> This initialises an empty array, for the application to store user information in
		-> This is part of the application's use of memory 
		-> An external MongoDB database could also be used to achieve this

	Defining constants for the project <- 6/6:
		-> The final variable that this block of code defines is a second empty array 
		-> This initialises a further array, to store information about the user's exercise which is entered into the application
		-> This is similar to the previous variable which was initialised 
	
	-> This section of code imported the modules which we later use to create middleware for the application 
	-> This also initialised arrays which we will use to store its data, and created an instance of the express application for this
*/

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
let users = [];
let exercises = [];







app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));










app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});










// Create a new user
app.post('/api/users', (req, res) => {
  const { username } = req.body;
  const newUser = { _id: users.length + 1, username };
  users.push(newUser);
  res.json(newUser);
});

// Add exercises to a user
app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  const newExercise = { userId: _id, description, duration, date };
  exercises.push(newExercise);
  res.json(newExercise);
});














// Get user's exercise log
app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  let filteredExercises = exercises.filter(exercise => exercise.userId === _id);

  if (from) {
    filteredExercises = filteredExercises.filter(exercise => exercise.date >= from);
  }

  if (to) {
    filteredExercises = filteredExercises.filter(exercise => exercise.date <= to);
  }

  if (limit) {
    filteredExercises = filteredExercises.slice(0, limit);
  }

  const user = users.find(user => user._id === _id);
  const log = filteredExercises.map(exercise => ({
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date,
  }));
  const count = filteredExercises.length;

  res.json({
    _id,
    username: user.username,
    count,
    log,
  });
});

























const PORT = process.env.PORT || 8080;
const listener = app.listen(PORT, () => {
  console.log('Your app is listening on port ' + PORT);
});
