# WebDev_G32

It is an ecommerce website allowing user to buy and sell phones.

## dependencies

  - bcryptjs
  - body-parser
  - cors
  - crypto
  - ejs
  - express
  - express-mongo-sanitize
  - express-session
  - jsonwebtoken
  - loadash
  - mongoose
  - multer
  - nodemailer
  - nodemailer-smtp-transport
  - passport


## Installing
- Go to the directory

- In MongoDb, create a database called : assignment2Gp32

  - Create a collection called: users

  - Create a collection called: phoneListing

  - In the CMD

    - execute mongoimport --jsonArray --db assignment2Gp32 --collection users --file < location of userlist.json >

    - execute mongoimport --jsonArray --db assignment2Gp32 --collection phoneListing --file < location of phoneListing.json >

  - Execute for all brands.

    - db.getCollection('phoneListing').updateMany({}, [{$set:{"image":{$concat: ["/images/phone_default_images/", "$brand", ".jpeg"]}}}]);

  ## Executing Program
- npm install

- npm start

# Authors

Alan Hoang - ahoa5624
Liam ireland - lire2640
Xihan Liu - xliu3349

# Tasks completed

##

## User login and authentification
A session is created with the user_id when the client sign ins or sign up.

For profile, checkout buttons, there is a middlewear that makes sure the session has a user_id otherwise, it will be redirected to the main page.

For sign in and sign up, there is a middlewear that makes sure that if the session has a user_id, it will be redirected to the main page.

Signout will destroy the session. When the session is destroyed, then the client will be unable to access profile and checkout due to the middlewear. There is a modal to confirm if you wish to sign out.

If a user is searching something or have selected something in the main page but is not signed in, they will be reverted back to that page when they immediately sign in or sign up.

If the user has forgotten the password, a link will be sent to an email they input. If the email does exist, they will receive an email with a link. It expires in 20mins. Then the user can change their password. once the password is change the link will be invalid

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

If you click on the row of the table, then it will lead you to the item. However, this will only occur when the item is enabled.

## Checkout

### Functions

When the user adds to the cart, a modal will pop up with the quantity in which they want to purchase. There is a custom validation to ensure
- only postive integers can be inputted
- if the user current stock of the product + requested quantity must be less than current stock in shop

The user can update the quantity of each product in the checkout. Once again the validations ensure that current stock of the product + requested quantity must be less than current stock in shop

The user can remove multiple products in the checkout (tick checkbox)


### Edge cases

- User are allowed to buy mulitple times of the same product. Each time a user buys, it will check if the current stock is greater than the stock in cart + stock

- If users have items in the cart,

  - The item is SOLD out or has been disabled, then when the user goes to checkout, these products will be removed and a message will show.

  - If the items are sold are not completely sold out but the remaining stock is less than the items in the cart, when the user goes to the checkout, these quantities will be udpated and a message will show


## Main Page

### Function

- Ensures that stock of less than 0 will not show up. In addition, for top 5 and sold out, stock must be at least 1


### Edge Cases

- When a user uploads a phone for sale and then the user's account is removed, it will still show in the Phone zone website but when its in the item state, no one can add to cart and it will say Seller Unknown.
