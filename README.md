# Lights Berry

This is the backend that will run in the Raspberry Pi and will talk to it.

1. It will talk to the server to request the information at first, the controller_id.
2. It will post the light when it gets the controller_id.
3. It will listen to the server in Heroku and will do all the work there.

# Database

The database code is the following:

For the Controller:

```
CREATE TABLE Controller(
  id INT NOT NULL,
  phone_id INT NOT NULL,
  created DATE NOT NULL,
  updated DATE NOT NULL,
  PRIMARY KEY (id)
);
```

For the Lights:

```
CREATE TABLE Lights(
  id INT NOT NULL,
  status BOOL NOT NULL,
  intensity FLOAT NOT NULL,
  red FLOAT NOT NULL,
  green FLOAT NOT NULL,
  blue FLOAT NOT NULL,
  created DATE NOT NULL,
  updated DATE NOT NULL,
  controller_id INT NOT NULL,
  PRIMARY KEY (id)
);

ALTER TABLE Lights ADD CONSTRAINT lights_fkey FOREIGN KEY (controller_id) REFERENCES Controller(id)
```
