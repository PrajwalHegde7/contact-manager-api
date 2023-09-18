# Contact Book

keep personal contact information.  
Full stack app built by RESTful api in JSON.  
React, Node.js, Express, MongoDB  
User authentication implemented by JWT token.

deployed at [Heroku](https://contact-book-mern.herokuapp.com/login)

## Usage

Install dependencies

```bash
npm install  
npm client-install # Client side install
```

### Mongo connection setup

Edit /config/default.json file to include the correct MongoDB URI
```json
{
  "mongoURI": "mongodb+srv://<username>:<password>@<mongoatlascluster>",
  "jwtSecret": "your-secrect-string",
  "jwtLife": 3600
}
```

### Run Server

```bash
npm run dev     # Express & React :3000 & :5000
npm run server  # Express API Only :5000
npm run client  # React Client Only :3000
```

## JSON API end point
`/api/auth` GET # return user info for valid token  
`/api/auth` POST # login a user, if success, return a token  
`/api/user` POST # register a user   
`/api/contacts` GET # all contacts. valid token required  
`/api/contacts` POST # new contact. valid token required  
`/api/contacts/:id` PUT # update contact. valid token required  
`/api/contacts/:id` DELETE # delete contact. valid token required

### send token in the http request header
```http
"x-auth-token": "JWT.token.string"
```

### user schema
```json
{
  "name": "Micheal Smith",
  "email": "micheal@xyz.com",
  "password": "sixormorechars"
}
```

### contact schema
```json
{
  "_id":"",
  "name": "required",
  "email": "",
  "phone": "",
  "type": "personal"
}
```