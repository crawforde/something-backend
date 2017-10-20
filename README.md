# HoHoHo Backend Testing Module

**IMPORTANT NOTES**
    - Make sure to complete the [Mocha/Chai Video Series](../day2.md) before attempting this exercise.
    - Your tests should all be in the `/hohoho_backend/test/api_tests.js` file

Today you will be writing tests to ensure that the HoHoHo API works as expected. You have been given the necessary files to run the API locally (meaning your tests should test the API running on `localhost` rather than on Heroku). Keep in mind that you will have to modify the HoHoHo codebase to implement proper functionality for certain endpoints.

API Reference: https://github.com/horizons-school-of-technology/week07/tree/master/day1/hohoho#api

## API Tests

The following sections will walk you through testing the appropriate endpoints. There are icons next to each test denoting whether the test is provided and whether the test is passing.

Legend:

- :pencil2: : Test needs to be written
- :beetle: : Implementation needs to be written

Examples:
- [empty]
    - **BOTH** the test has been provided and the test passes. So you do not have to write anything (but we advise you to read & understand the test's functionality).
- :pencil2:
    - The test is not written, so you will have to write it. Once written, the test will pass.
- :pencil2: :beetle:
    - The test is not written, nor is the test passing. You will have to write the test, and then modify the HoHoHo backend codebase to implement specified functionality.

### Before

We have included the following code segment to run before executing **every** `describe` block. This means that it will allow you to start every set of tests with a clean slate. As a result, you will have to register/login whenever your tests require a user.

```js
// Delete all data before testing
before(function(done) {
    User.remove()
    .then(function() {
      return Message.remove();
    })
    .then(function() {
      done();
    });
});
```

### Part 1: `POST /register`

1. Register a User
      - Given a valid username & password, successfully register the user
1. Check if Username exists :pencil2:
      - Test if user can register without entering a username
1. Check if Password exists :pencil2: :beetle:
      - Test if user can register without entering a password
1. Prohibit duplicate Usernames :pencil2: :beetle:
      - Only register the user **if** the entered username does not exist.
      - **Hint:** Look at the `unique` option for [Mongoose Schemas](http://mongoosejs.com/docs/2.7.x/docs/schematypes.html)

### Part 2: `POST /login`

From now on you will need to use `chai.request.agent(app)` in order to retain cookies from your login/register requests.

Example:
```js
chai.request.agent(app)
    .post(/* ENDPOINT */)
    .send(/* DATA */)
    .end(function(err, res) {/* CHECK ERROR/STATUS */});
```

1. Login with correct credentials
      - Given a valid username & password, successfully log in the user
1. Login with incorrect username :beetle:
      - User should not be able to log in given an invalid username
      - Write an assertion making sure this requests responds with status `401`
1. Login with incorrect password :pencil2: :beetle:
      - User should not be able to log in given a correct username, but incorrect password
      - Your implementation should respond with status `401` in this case

### Part 3: `GET /users`

You can set `chai.request.agent` to a variable at the top of your `describe` block, and use the variable to register/login and perform and future requests that require a logged in user. You can also, in the `before` block, register a new user and log them in (so that you don't have to do that for every test within the `describe` block).

<details><summary>
Hint
</summary><p>

```js
var agent = chai.request.agent(app);
before(function(done) {
    agent
      .post('/register')
      .send({
        YOURUSERNAMEHERE,
        YOURPASSWORDHERE
      })
      .end(function(err, res) {
        // TODO: check for error/success
        // TODO: perform a login request HERE
      });
});
```

</p></details>

1. Page access requires user to be logged in :beetle:
    - Ensure that this page can ONLY be accessed once a user is logged in
    - Note that this test already exists, so your job is merely to implement functionality
1. `GET` a non-empty list of users :pencil2:
    - Create an arbitrary number of users (at least one)
    - Test whether `GET /users` responds with the entire non-empty list of those users
1. **BONUS:** Limit list to 25 users :pencil2: :beetle:
    - Create **more than** 25 users (DO NOT hardcode, find a better way)
    - Modify your implementation so that it only responds with 25 users
    - Test whether `GET /users` responds with only 25 users

### Part 4: `POST /messages`

1. Page access requires user to be logged in :pencil2: :beetle:
    - Ensure that this page can ONLY be accessed once a user is logged in
1. Ensure that the `to` field is required :pencil2:
    - Write a test to make sure that the `to` field is **required** in the `POST` request
1. Send message to self :pencil2:
    - You should be able to successfully send a message to yourself
    - How would you get `userId` for yourself?

    <details><summary>
    Hint
    </summary><p>

    You can fine `userId` in the response body of the `POST` request to `/register`

    </p></details>

### Part 5: `GET /messages`

1. Page access requires user to be logged in :pencil2: :beetle:
    - Ensure that this page can ONLY be accessed once a user is logged in
1. **BOTH** `to` and `from` fields are populated :pencil2:
    - Make sure the `to` and `from` fields both contain a username
    - The `to` & `from` fields should look like:
      ```js
      "to": {
        "_id": "TO USER ID HERE",
        "username": "TO USERNAME HERE"
      },
      "from": {
        "_id": "FROM USER ID HERE",
        "username": "FROM USERNAME HERE"
      },
      ```
1. Received messages are sorted :pencil2: :beetle:
    - Test whether the messages from the `GET` request are in **reverse chronological order**
1. Include **sent** messages from logged in user :pencil2: :beetle:
    - Test whether the messages from the `GET` request include messages **sent** from the currently logged in user
1. **BONUS:** Include messages **sent to** logged in user :pencil2:
    - Test whether the messages from the `GET` request include messages **sent to** the currently logged in user
