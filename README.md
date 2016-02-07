# Lights Berry

This is the backend that will run in the Raspberry Pi and will talk to it.

1. It will talk to the server to request the information at first, the controller_id.
2. It will post the light when it gets the controller_id.
3. It will listen to the server in Heroku and will do all the work there.
