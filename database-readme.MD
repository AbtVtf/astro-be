Table List:

zodiacs
Fields:
zodiac_id (Primary Key)
name
start_date
end_date

crystals
Fields:
crystal_id (Primary Key)
name
description

zodiacs_crystals
Fields:
zodiac_id (Foreign Key & Part of Composite Primary Key)
crystal_id (Foreign Key & Part of Composite Primary Key)

users
Fields:
user_id (Primary Key)
username
email
password

user_zodiacs
Fields:
user_id (Foreign Key & Part of Composite Primary Key)
zodiac_id (Foreign Key & Part of Composite Primary Key)
user_crystals

Fields:
user_id (Foreign Key & Part of Composite Primary Key)
crystal_id (Foreign Key & Part of Composite Primary Key)

affirmations
Fields:
affirmation_id (Primary Key)
user_id (Foreign Key)
affirmation_text

tarot_readings
Fields:
reading_id (Primary Key)
user_id (Foreign Key)
card_name
card_interpretation

houses
Fields:
house_id (Primary Key)
name

planets
Fields:
planet_id (Primary Key)
name

Relationships:
zodiacs_crystals

zodiac_id REFERENCES zodiacs(zodiac_id)
crystal_id REFERENCES crystals(crystal_id)
user_zodiacs

user_id REFERENCES users(user_id)
zodiac_id REFERENCES zodiacs(zodiac_id)
user_crystals

user_id REFERENCES users(user_id)
crystal_id REFERENCES crystals(crystal_id)
affirmations

user_id REFERENCES users(user_id)
tarot_readings

user_id REFERENCES users(user_id)
Diagram Representation:
Below is a textual representation of how the tables could be related in a database schema:

zodiacs <---> zodiacs_crystals <---> crystals
users <---> user_zodiacs <---> zodiacs
users <---> user_crystals <---> crystals
users <---> affirmations
users <---> tarot_readings
houses (Standalone Table)
planets (Standalone Table)
SQL Scripts:
Here is a consolidated SQL script for creating all the mentioned tables and their relationships:

CREATE TABLE IF NOT EXISTS zodiacs (
  zodiac_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  start_date VARCHAR(255) NOT NULL,
  end_date VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS crystals (
  crystal_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS zodiacs_crystals (
  zodiac_id INT,
  crystal_id INT,
  PRIMARY KEY(zodiac_id, crystal_id),
  FOREIGN KEY(zodiac_id) REFERENCES zodiacs(zodiac_id),
  FOREIGN KEY(crystal_id) REFERENCES crystals(crystal_id)
);

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_zodiacs (
  user_id INT,
  zodiac_id INT,
  PRIMARY KEY(user_id, zodiac_id),
  FOREIGN KEY(user_id) REFERENCES users(user_id),
  FOREIGN KEY(zodiac_id) REFERENCES zodiacs(zodiac_id)
);

CREATE TABLE IF NOT EXISTS user_crystals (
  user_id INT,
  crystal_id INT,
  PRIMARY KEY(user_id, crystal_id),
  FOREIGN KEY(user_id) REFERENCES users(user_id),
  FOREIGN KEY(crystal_id) REFERENCES crystals(crystal_id)
);

CREATE TABLE IF NOT EXISTS affirmations (
  affirmation_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  affirmation_text TEXT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS tarot_readings (
  reading_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  card_name VARCHAR(255) NOT NULL,
  card_interpretation TEXT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS houses (
  house_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS planets (
  planet_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);