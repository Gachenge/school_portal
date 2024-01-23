# School App API - OpenAPI 3.0

This is an OpenAPI 3.0 specification for a School App API. This API helps a school keep track of students, teachers, subjects and their grades. It also helps a library keep track of it books and library members.

## Table of Contents

- [Authentication](#authentication)
- [Blog](#blog)
- [Comments](#comments)
- [Library](#library)
- [Student](#student)

## Authentication
 
- **Signup:** A user enters their username, email and password.
    
    - **Endpoint:** `/api/oauth/sign_up`
    - **HTTP Method:** POST
    - **Description:** This endpoint accept a users email and username, verifies they are unique and then checks if the password and confirm passwrod are similar, before encrypting the password and saving these details in a database.
    - **Request Body Example:**
    ```json
    {
      "username": "John",
      "email": "john@doe.com",
      "password": "jsa*f456!",
      "confirm_password": "jsa*f456!"
    }
    ```
    - **Responses:**
        - **200:** Signup successful
        - **400:** The details entered are incorrect
        - **409:** The user is already registered
        - **500:** Internal server error

- **Login:** A user can then sign in

    - **Endpoint:** `/api/oauth/login`
    - **HTTP Method:** POST
    - **Description:** A user can login with their username and password.
    - **Request Body Example:**
    ```json
    {
      "username": "John",
      "password": "jsa*f456!"
    }
    ```
    - **Responses:**
        - **200:** Login successful
        - **400:** The details entered are incorrect
        - **500:** Internal server error

- **Logout:** Clears the session data.

  - **Endpoint:** `/api/oauth/logout`
  - **HTTP Method:** POST
  - **Description:** This endpoint clears the session data for the current user.
  - **Responses:**
    - **200:** Successful logout
    - **400:** The access token is invalid
    - **401:** Invalid or expired token
    - **404:** Invalid token. user not found
    - **500:** Internal server error

- **Refresh:** Refresh your access token

    - **Endpoint:** `/api/oauth/refresh`
    - **HTTP Method:** POST
    - **Description:** the access token expires every 15 minutes. This endpoint refreshes the token
    - **Responses:**
         - **200:** Successful response
         - **401:** Invalid token
         - **500:** Internal server error

- **Verify Email:** Verify users email address

    - **Endpoint:** `/api/oauth/verify_email/:token`
    - **HTTP Method:** GET
    - **Description:** A user, once signed up is required to verify their email address. after a user signs up, an email is sent to their email, with a verification token.
    - **Responses:**
        - **200:** Successful response
        - **404:** Invalid token. No user found.
        - **500:** Internal server error

- **Reset Password:** Reset the users password

    - **Endpoint:** `/api/oauth/forgot_password`
    - **HTTP Method:** POST
    - **Description:** if a user forgot their password, this endpoint helps them reset the password and enter a new one.
    - **Responses:**
        - **200:** Successful response
        - **404:** The details entered are incorrect
        - **500:** Internal server error

## Blog

- **Create Blog:** Create a new blog

    - **Endpoint:** `/api/blog/`
    - **HTTP Method:** POST
    - **Description:** A user can post a new blog, that is accessible to all other users
    - **Request Body Example:**
    ```json
    {
      "title": "Blog title",
      "body": "the body",
      "image": "optional image url"
    }
    ```
    - **Responses:**
        - **201:** Successful response
        - **400:** The details entered are incorrect
        - **401:** User not signed in
        - **409:** Blog already created
        - **500:** Internal server error

- **Get All Blogs:** Get all blogs

    - **Endpoint:** `/api/blog`
    - **HTTP Method:** GET
    - **Description:** Get a list of all blogs
    - **Responses:**
        - **200:** Successful response
        - **500:** Internal server error

- **Get Blog:** Get a blog by id

    - **Endpoint:** `/api/blog/:id`
    - **HTTP Method:** GET
    - **Description:** Get a specific blog by its id
    - **Responses:**
        - **200:** Successful response
        - **400:** Invalid id
        - **404:** Blog not found
        - **500:** Internal server error

- **Edit Blog:** Edit blog by id

    - **Endpoint:** `/api/blog/:id`
    - **HTTP Method:** PATCH
    - **Description:** The author of a blog can edit either parts or all of the blog
    - **Request Body Example:**
    ```json
    {
      "title": "Edit title",
      "body": "edit body",
      "image": "edit image url"
    }
    ```
    - **Responses:**
        - **200:** Successful response
        - **400:** Invalid details
        - **401:** User not authenticated
        - **403:** Only the author can edit
        - **404:** Blog not found
        - **500:** Internal server error

- **Delete Blog:** Delete a blog post

    - **Endpoint:** `/api/blog/:id`
    - **HTTP Method:** DELETE
    - **Description:** An author or the admin may choose to delete a particular blog
    - **Responses:**
        - **204:** Successful response
        - **400:** Invalid blog id
        - **401:** You are not signed in
        - **404:** Blog not found
        - **500:** Internal server error

## Comments

- **Create a comment:** Create a comment on a blog post

    - **Endpoint:** `/api/post/:id/comment`
    - **HTTP Method:**  POST
    - **Description:** Any user can comment on any blog post
    - **Request Body Example:**
    ```json
    {
      "post": "post body",
      "image": "post image url"
    }
    ```
    - **Responses:**
        - **201:** Successful response
        - **400:** Invalid details
        - **401:** You are not logged in
        - **404:** Blog post not found
        - **500:** Internal server error

- **Get all comments:**  Get a list of all comments on a post

    - **Endpoint:** `/api/post/:id/comment`
    - **HTTP Method:** GET
    - **Description:** All comments on a particular blog post
    - **Responses:**
        - **200:** Successful response
        - **400:** Invalid blog id
        - **500:** Internal server error

- **Get comment by id:** Get a comment by its id

    - **Endpoint:** `api/post/:id`
    - **HTTP Method:** GET
    - **Description:** Get a particular comment by its id
    - **Responses:**
        - **200:** Succesful response
        - **400:** Invalid comment id
        - **404:** Comment not found
        - **500:** Internal server error

- **Edit comment by id:** Edit a comment

    - **Endpoint:** `/api/post/:id`
    - **HTTP Method:** PATCH
    - **Description:** A user can edit a comment they created
    - **Request Body Example:**
    ```json
    {
      "post": "edit post body",
      "image": "edit post image url"
    }
    ```
    - **Responses:**
        - **200:** Successful response
        - **400:** Invalid details
        - **401:** You are not signed in
        - **403:** You are not authorised to edit this comment
        - **404:** Comment not found
        - **500:** Internal server error

- **Delete comment:** Delete a comment

    - **Endpoint:** `/api/post/:id`
    - **HTTP Method:** DELETE
    - **Description:** A user who created a comment can delete it
    - **Responses:**
        - **204:** Successful response
        - **400:** Invalid comment id
        - **401:** User not signed in
        - **403:** User not authorised
        - **404:** Comment not found
        - **500:** Internal server error

## Library

### Books

- **Create Books:** Add books to the library

    - **Endpoint:** `/api/library/books`
    - **HTTP Method:** POST
    - **Description:** A librarian or an admin can create another book to add to the collection
    - **Request Body Example:**
    ```json
    {
      "title": "title of the book",
      "author": "author of the book",
      "copies": "number of copies"
    }
    ```
    - **Responses:**
        - **200:** Successful response
        - **400:** Invalid details
        - **401:** You are not signed in
        - **403:** You are not authorised
        - **404:** User not found
        - **409:** Book already added
        - **500:** Internal server error

- **All Books:** A list of all books in the library

    - **Endpoint:** `/api/library/books`
    - **HTTP Method:** GET
    - **Description:** Get a list of all books in the library. Only a library member can access this
    - **Responses:**
        - **200:** Successful response
        - **401:** User not signed in
        - **403:** You are not a library member
        - **500:** Internal server error

- **Book by Id:** Get a particular book by id

    - **Endpoint:** `/api/library/books/:id`
    - **HTTP Method:** GET
    - **Description:** Get a aprticular book with more of its details. Only a library member can access this
    - **Responses:**
        - **200:** Successful response
        - **400:** Invalid book id
        - **401:** You are not signed in
        - **403:** You are not authorised
        - **404:** Book not found
        - **500:** Internal server error

- **Edit Book:** Edit a particular book

    - **Endpoint:** `/api/library/books/:id`
    - **HTTP Method:** PATCH
    - **Description:** Edit a book. either of the details or all of them. Only a librarian can access this
    - **Request Body Example:**
    ```json
    {
      "title": "title of the book",
      "author": "author of the book",
      "copies": "number of copies"
    }
    ```
    - **Responses:**
        - **200:** Successful response
        - **400:** Invalid details
        - **401:** User not signed in
        - **403:** You are not authorised
        - **409:** Book already registered
        - **500:** Internal server error

- **Delete Book:** Delete a book

    - **Endpoint:** `/api/library/books/:id`
    - **HTTP Method:** DELETE
    - **Description:** delete a particular book. Only a librarian can access this
    - **Responses:**
        - **204:** Successful response
        - **400:** Invalid details
        - **401:** User not signed in
        - **403:** You are not authorised
        - **404:** Book not found
        - **500:** Internal server error

- **Borrow book:** Borrow a book

    - **Endpoint:** `/api/library/book/borrow`
    - **HTTP Method:** PATCH
    - **Description:** allow library members to borrow a book
    - **Request Body Example:**
    ```json
    {
      "bookId": "id of the book"
    }
    ```
    - **Responses:**
        - **200:** Successful resonse
        - **400:** Invalid details
        - **401:** User not signed in or has overdue books
        - **403:** You are not authorised
        - **404:** Book not found or user not a member
        - **500:** Internal server error

- **Return book:** Return a borrowed book

    - **Endpoint:** `/api/library/book/return`
    - **HTTP Method:** PATCH
    - **Description:** members can return borrowed books
    - **Request Body Example:**
    ```json
    {
      "bookId": "id of the book"
    }
    ```
    - **Responses:**
        - **200:** Successful resonse
        - **400:** Invalid details
        - **401:** User not signed in or has overdue books
        - **403:** You are not authorised
        - **404:** Book not found
        - **500:** Internal server error

### Members

- **Add members:** Add or create new library members

    - **Endpoint:** `/api/library/members`
    - **HTTP Method:** POST
    - **Description:** a librarian can upgrade users who have signed up and make them library members
    - **Request Body Example:**
    ```json
    {
        "id": "some user's id"
    }
    ```
    - **Responses:**
        - **200** Successful response
        - **400** Invalid details
        - **401** User not signed in
        - **403** User not authorised
        - **404** User not found
        - **409** Member already registered
        - **500** Internal server error

- **All members:** Get all members

    - **Endpoint:** `/api/library/members`
    - **HTTP Method:** GET
    - **Description:** a librarian or an admin can access a list of all library members registered
    - **Responses:**
        - **200** Successful response
        - **401** User not signed in
        - **403** User not authorised
        - **404** User not found
        - **500** Internal server error

- **Member by id:** Get a particular member by their id

    - **Endpoint:** `/api/library/members/:id`
    - **HTTP Method:** GET
    - **Description:** get more details on a member using their id
    - **Responses:**
        - **200** Successful response
        - **400** Invalid details
        - **401** User not signed in
        - **403** User not authorised
        - **404** User not found
        - **500** Internal server error

- **Delete member:** Delete a particular member by their id

    - **Endpoint:** `/api/library/members/:id`
    - **HTTP Method:** DELETE
    - **Description:** delete a particular member by their id
    - **Responses:**
        - **204** Successful response
        - **400** Invalid details
        - **401** User not signed in
        - **403** User not authorised
        - **404** User not found
        - **500** Internal server error

## Student

- **Add Students:** add new students

    - **Endpoint:** `/api/students`
    - **HTTP Method:** POST
    - **Description:** An admin can add new students from signed up users
    - **Request Body Example:**
    ```json
    {
        "id": "some user's id"
    }
    ```
    - **Responses:**
        - **200** Successful response
        - **400** Invalid details
        - **401** User not signed in
        - **403** User not authorised
        - **404** User not found
        - **409** Student already registered
        - **500** Internal server error

- **Student by Id:** get a particular student by their id

    - **Endpoint:** `/api/students/:id`
    - **HTTP Method:** GET
    - **Description:** Get more details about a particular student. Only an admin or teacher can access this.
    - **Responses:**
        - **200** Successful response
        - **400** Invalid details
        - **401** User not signed in
        - **403** User not authorised
        - **404** User not found
\        - **500** Internal server error
    
- **Add Student Subject:** Add a subject to a students profile

    - **Endpoint:** `/api/students/subject`
    - **HTTP Method:** POST
    - **Description:** A student can add subjects to their profile. Students can pick the subjects they take
    - **Request Body Example:**
    ```json
    {
        "subjectName": "Example subject"
    }
    ```
    - **Responses:**
        - **200** Successful response
        - **400** Invalid details
        - **401** User not signed in
        - **403** User not authorised
        - **404** Subject not found
        - **409** Subject already registered
        - **500** Internal server error

- **Delete Student Subject:** Delete a subject from a students profile

    - **Endpoint:** `/api/students/subject`
    - **HTTP Method:** PATCH
    - **Description:** A teacher or an admin can remove subjects from a student's profile.
    - **Request Body Example:**
    ```json
    {
        "studentId": "a student's id",
        "subjectName": "Example subject"
    }
    ```
    - **Responses:**
        - **204** Successful response
        - **400** Invalid details
        - **401** User not signed in
        - **403** User not authorised
        - **404** Subject not found
        - **500** Internal server error

- **View grades:** View student grades

    - **Endpoint:** `/api/students/grades`
    - **HTTP Method:** GET
    - **Description:** A student can view their own grades for all the subjects they take
    - **Responses:**
        - **200** Successful response
        - **400** Invalid details
        - **401** User not signed in
        - **403** User not authorised
        - **404** Subject not found
        - **500** Internal server error

## Teachers

- **All teachers:** Get all teachers

    - **Endpoint:** `/api/teachers`
    - **HTTP Method** GET
    - **Description:** an admin or a teacher can get a list of all teachers registered
    - **Responses:**
        - **200** Successful response
        - **401** User not signed in
        - **403** User not authorised
        - **500** Internal server error

- **Add teachers:** Create teacher

    - **Endpoint:** `/api/teachers`
    - **HTTP Method** POST
    - **Description:** An admin can create new teachers from the users already signed in
    - **Request Body Example:**
    ```json
    {
        "id": "some user's id"
    }
    ```
    - **Responses:**
        - **200** Successful response
        - **400** Invalid details
        - **401** User not signed in
        - **403** User not authorised
        - **404** User not found
        - **409** Teacher already registered
        - **500** Internal server error

- **Teacher By Id:** Get a teacher by id

    - **Endpoint:** `/api/teachers/:id`
    - **HTTP Method** GET
    - **Description:** Get more details on a teacher by the teacher id
    - **Responses:**
        - **200** Successful response
        - **400** Invalid details
        - **401** User not signed in
        - **403** User not authorised
        - **404** User not found
        - **500** Internal server error

- **Teacher Subject:** Add subjects to a teachers profile

    - **Endpoint:** `/api/teachers/subjects`
    - **HTTP Method** POST
    - **Description:** Add the subjects the teacher teaches. This is done by the admin
    - **Request Body Example:**
    ```json
    {
        "teacherId": "some teacher's id",
        "subjectName": "some subject name"
    }
    ```
    - **Responses:**
        - **200** Successsful response
        - **400** Invalid details
        - **403** You are not authorised
        - **404** Teacher or subject not found
        - **500** Internal server error

- **Remove subject:** Remove subject from a teachers profile

    - **Endpoint:** `/api/teachers/subjects`
    - **HTTP Method** PATCH
    - **Description:** Remove a subject from a teachers profile
    - **Request Body Example:**
    ```json
    {
        "teacherId": "some teacher's id",
        "subjectName": "some subject name"
    }
    ```
    - **Responses:**
        - **200** Successsful response
        - **400** Invalid details
        - **403** You are not authorised
        - **404** Teacher or subject not found
        - **500** Internal server error


- **Grade students:** Add a grade to a students profile

    - **Endpoint:** `/api/teachers/grade`
    - **HTTP Method:** POST
    - **Description:** A teacher can grade all students taking the subject they teach
    - **Request Body Example:**
    ```json
    {
        "studentId": "some student's id",
        "subjectName": "some subject name",
        "studentGrade": "the grade"
    }
    ```
    - **Responses:**
        - **200** Successful response
        - **400** Invalid details
        - **401** User not signed in
        - **403** User not authorised
        - **404** User not found
        - **500** Internal server error

- **Remove grade:** Remove grade from students profile

    - **Endpoint:** `/api/teachers/grade`
    - **HTTP Method:** PATCH
    - **Description:** A teacher can edit a students grade for the subject they teach
     - **Request Body Example:**
    ```json
    {
        "gradeId": "the grade"
    }
    ```
    - **Responses:**
        - **200** Successful response
        - **400** Invalid details
        - **401** User not signed in
        - **403** User not authorised
        - **404** User not found
        - **500** Internal server error


## Security

- JWT Token Authentication is used for securing the API. on login, an access token cookie is assigned to the user

## License

This API is available under the [MIT License](https://opensource.org/licenses/MIT).

If you have any questions or need further information, please contact the author at gachenge1@gmail.com.

API Version: 1.0.0
