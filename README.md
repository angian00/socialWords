## Social

A simple draft of social API.

### Installation
Prerequisites: basic Node.js installation.
git clone the whole repository. From the root of the project, run node install.


### Running
Execute > node socialapi.js
Point your browser to http://localhost:8080.


### API

#### Users

GET     /api/users 			return a list of all registered users

GET     /api/users/<id> 	return info for a specific user
POST    /api/users/<id> 	create a new user
PUT     /api/users/<id> 	update info for a user
DELETE  /api/users/<id> 	delete a user


#### Messages

GET     /api/msgs 			return a list of messages sent/received by a specific user (logged in user by default)
			?user_id=...

GET     /api/msgs/<id> 		return info for a specific message

POST    /api/msgs/<id> 		create a new message

PUT     /api/msgs/<id> 		update info for a message

DELETE  /api/msgs/<id> 		delete a message


#### Contacts

GET     /api/contacts 			return a list of all contacts of a specific user (logged in user by default)
			?user_id=...

GET     /api/contacts/<id> 		return info for a specific contact
			?user_id=...

POST    /api/contacts/<id> 		create a new contact
			?user_id=...

PUT     /api/contacts/<id> 		update info for a contact
			?user_id=...

DELETE  /api/contacts/<id> 		delete a contact
			?user_id=...

