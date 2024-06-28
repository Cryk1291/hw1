[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/Y8bW3OQP)
# Exam #1: "Ticketing system”"
## Student: s332088 Di Bella Giovanni Luca 

## React Client Application Routes

- Route `/`: Homepage of the application, is the basic route from where the others branch out. It contains the navigation bar, the list of tickets and the form for inserting a new ticket.
- Route `/login`: Redirects to the login section, from here is possible to perform the login, or going back to the home page.
- Route `*`: Redirects to the NotLayoutFound Section, in which the only possible action is to return to the home page.
- Route `/addTicket`: This page contains the form for inserting a new ticket, no parameters are specified
- Route `/addTicket/ticket-confirmation`: This page is a modal that overlaps to the form for adding the ticket. No parameters are used because the fields of the ticket are passed using a "ticket" temporary state. After the insert into the database the "ticket" state is emptied.


## API Server

- GET `/api/tickets`: Request the list of tickets from db
  -  No input parameters
  -  Response body: JSON object with the list of tickets, or description of the error(s)
     ``` Shell
     [ { id: 6, state: 'closed', owner: 'Melonwater', title: 'How to escape from jail', category: 'maintenance', timeStamp: '2024-06-27 12:17:43', request: '' }, ... ]
     ```
- POST `/api/addTicket` : Allows to add a new ticket into the database
  -  Request Body: JSON object with the ticket to add
     ```Shell
     { 'state': 'open', 'category':'maintenance', 'owner':'Melonwater', 'title':'how to escape from jail',  'request': 'xxxxxxx' }
     ```
  - Response body: JSON object with a confirmation message, or JSON object with the description of the error(s)
    ```Shell
    { ok: true, message: "Insert Successfull!" }
    { ok: false, message: "Title length cannot be 0!" }
    ```
- GET `/api/comments/:ticket_id`: Request the full list of comments associated with a ticket (provided the ticket id), only for authenticated users
  - Input Parameters: id of the ticket to which retrieve the comments from
  - Response body: JSON object with the list of comments (empty array if there are no comments), or description of the error(s)
    ```Shell
    0: Object { id: 1, comment_text: "Try rebooting<br>, the pc", timestamp: "2024-06-27 12:17:43", … }
    / Array []
    / {"ok": false, "message":"Not Authenticated"}
    ```
- GET `/api/request/:id`: Get the first block (description of the ticket), only for authenticated users
  - Input Parameters: id of the ticket to which retrieve the content of the request
  - Response body: JSON object with "ok" field and the content, or description of the error(s)
    ```Shell
    { ok: true, message: "<u>I have a problem watching this movie</u>!!!" }
    {"ok": false, "message":"Not Authenticated"}
    ```
- POST `/api/add/comment`: Allows to add a new comment associated to a ticket (both the ticket id and the comment are provided inside the body of the request)
  - Request body: JSON object containing the content and the id of the ticket associated with the comment
    ```Shell
    { ticket_id: 9, comment: "tgrrefdcsx" }
    ```
  - Response body: JSON object with "ok" field and the "success" or "failure" message
    ```Shell
    { ok: true, message: "Insert Successfull!" }
    { ok: false, message: "impossible sending the comment" }
    ```
- PUT `/api/update/comment/state`: Used to change the state of the tickets (if open => close by every authenticated user, if close => open only for administrators)
  - Request body: JSON object containing the new state and the id of the ticket to close/open
    ```Shell
    { id: 9, state: "open" }
    ```
  - Response body: JSON object with "ok" field and the "success" or "failure" message
   ```Shell
   { ok: true, message: "Update Successful" }
   { ok: false, message: "Error - Not Authenticated" }
   ```
- PUT `/api/update/ticket/category`: Allows to change the category of a ticket (provided the ticket id) only from administrators
  - Request body: JSON object containing the new category and the id of the ticket to change
    ```Shell
    { id: 9, category: "administrative" }
    ```
  - Response body: JSON object with "ok" field and  the "success" or "failure" message
    ```Shell
    { ok: true, message: "Insert Successfull!" }
    { ok: false, message: "Error changing the category" / "Error invalid category" / "Error: Not Authenticated" }
    ```
- POST `/api/session`: Authenticate and login the user
  - Request body: JSON object containing username and password for performing the login 
    ```Shell
    { username: "a@p.it", password: "password" }
    ```
  - Response body: JSON object containing the user infos (administrator, name and email) or description of the error(s)
    ```Shell
    { administrator: 1, email: "j@p.it", name: "John" }
    { message: "Invalid Username or Password" }
    ```
- DELETE `/api/sessions/current`: Deletes the cookie associated with the session of the user that sends the request
  - No Input parameters
  - No Outputs
- GET `/api/sessions/current`: Resume the session of the user in case it opens a new page/reload the page
 - No Input parameters
 - Response Body: JSON object containing the user infos (administrator, name and email) or "false" if the user is not logged
 ```Shell
  { id: 1, username: "j@p.it", name: "John", administrator: 1 }
 ```
 ```Shell
  false
 ```
- GET `/api/auth-token`: Request the token used in Server2 for requesting the close time estimation
  - No Input parameters 
  - Response Body: JSON object containing the "ok" field and the associated token or description of the error(s)
   ```Shell
  { ok: true, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbmlzdHJhdG9yIjoxLCJ1c2VyIjoxLCJpYXQiOjE3MTk1MDkzMTksImV4cCI6MTcxOTUwOTM3OX0.xQ6c1LHKyU2CRjH10XfNf-Mq0Wdo3aEWE8wqHcdj6B0" }
   { ok: false, message: "Not authenticated" }
   ```
 

## API Server2

- POST `/api/getEstimation`: Provides the close time estimation to the user that send the request
  - request header: 'Authorization': `Bearer ${token}`,
  - Request Body: JSON object containing the full tickets list + "closeTime" filed added for each ticket 
    ``` Shell
    [ { id: 9, state: "open", owner: "Andrew", category: "payment", closeTime: "334 hours", timeStamp: "2024-06-27 16:30:44"}, ...]
    ```
​​​

## Database Tables

- Table `users` - contains (email, name, hash, salt, administrator)
- Table `tickets` - contains (state, category, owner, title, request)
- Table `comments` - contains (comment_text, author, ticket_id)

## Main React Components
- `FormTicketLayout`: (in `formTicketLayout.jsx`) component handling the login form (handling error, confirmation section, addTicket)
- `FormTicketModal`: (in `formTicketModal.jsx`) modal for the confirmation section
- `LoginLayout`: (in `Layout.jsx`) Component for the login Form
- `TicketsLayout`: (in `Layout.jsx`) Component for the list of tickets
- `TicketElem`: (in `TicketList.jsx`) Component for the single ticket
- `CommentsList`: (in `TicketList.jsx`) Component for the list of comments
- `AddCommentForm`: (in `TicketList.jsx`)Component for adding a comment, creates the form.


## Screenshot

![Screenshot](./img/image.png)
![Screenshot](./img/ticket%20form.png)
![Screenshot](./img/ticket%20form%20modal.png)

## Users Credentials

<table>
  <thead>
    <tr>
      <th>Email</th>
      <th>Password</th>
      <th>Name</th>
      <th>Administrator</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #f8f8f8;">
      <td>j@p.it</td>
      <td>password</td>
      <td>John</td>
      <td>True</td>
    </tr>
    <tr>
      <td>g@p.it</td>
      <td>password</td>
      <td>Giacomo</td>
      <td>True</td>
    </tr>
    <tr style="background-color: #f8f8f8;">
      <td>a@p.it</td>
      <td>password</td>
      <td>Andrew</td>
      <td>False</td>
    </tr>
    <tr>
      <td>n@p.it</td>
      <td>password</td>
      <td>Ninj</td>
      <td>False</td>
    </tr>
    <tr style="background-color: #f8f8f8;">
      <td>m@p.it</td>
      <td>password</td>
      <td>Melonwater</td>
      <td>False</td>
    </tr>
  </tbody>
</table>

