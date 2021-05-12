# WebDev_G32

## Installing
- Go to the directory

- In MongoDb, create a database called : assignment2Gp32

  - Create a collection called: Users

  - Create a collection called: phoneListing

  - In the CMD

    - execute mongoimport --jsonArray --db assignment2Gp32 --collection users --file < location of userlist.json >

    - execute mongoimport --jsonArray --db assignment2Gp32 --collection phoneListing --file < location of phoneListing.json >

  - Execute for all brands.

    - db.getCollection('phoneListing').updateMany({}, [{$set:{"image":{$concat: ["/images/phone_default_images/", "$brand", ".jpeg"]}}}]);


- npm install

- npm start

# Tasks completed
## User login and authentification
A session is created with the user_id when the client sign ins or sign up.

For profile, checkout buttons, there is a middlewear that makes sure the session has a user_id otherwise, it will be redirected to the main page.

For sign in and sign up, there is a middlewear that makes sure that if the session has a user_id, it will be redirected to the main page.

Signout will destroy the session. When the session is destroyed, then the client will be unable to access profile and checkout due to the middlewear.

If a user is searching something or have selected something in the main page but is not signed in, they will be reverted back to that page when they immediately sign in or sign up.

## Validation
The validation that requires access to the database is in the controller.

The validation that checks the strings are correct (email string is an email, password has more than 8 letters and ect, names are not empty and have no numbers) are in the router. This is done because the router library has the capabilties to chain the validations.

If the validation errors, a json will be returned (no re rendering the page)

### Validation rules
#### Name
- Name cannot be empty

- Name cannot have numbers (only letters)

#### Email
- Follows this regex pattern : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

- The email does not exists in the database

#### Password
- Min length is 8 characters

- Cannot only be just text or just numbers

## Profile Page
Profile page will display the user's first name, last name and email

Users can change any of these features. Validation rules still apply. All responses will be in JSON format.(it will not re render the page)

User can change their password. Validation of their current password applies and validation of the new password also applies. All responses will be in JSON format.(it will not re render the page)

User can now see their listing. The row of the listing has the _id of that item

User can add listings. It will check the listing for the combination of title and brand.

If the User does not upload an image then it will lead to a default.jpeg image.

If the User uploads the image, it will named: < branch name >_< user_id >_< timestamp >.jpeg

To remove the listing use endpoint profile/removeListing with parameters req.body.removeId as the id of the listing.

To edit the listing for disabled or not disabled use endpoint profile/editListing with parameters req.body.editId (the id of the listing) ,req.body.disabled (boolean: True - Disabled and False - Enable)


# Further Steps
## Front end
### Style the pages for login, sign up , profile and layout of Main.
- Consider using bootstrap as it just simple html.
### Set up req and res for event listeners
- The front end needs to us fetch or ajax to get those json responses and use either vanilla js or jquery to paint the DOM.
Please ensure event.preventDefault() is applied to event listeners so that the page does not refresh.
### Validation rules
- Include very simple validation rules in the front end.

## Back End
### Consider the checkout page and think of steps to meeting the requirements.
### Consider further validation rules.
