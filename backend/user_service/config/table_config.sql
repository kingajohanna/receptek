DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
	User_ID VARCHAR(128) NOT NULL UNIQUE,
	Name TEXT NOT NULL,
	Email TEXT NOT NULL,
	Picture TEXT NOT NULL,
	Created_At DATE,
  	Updated_At DATE,
  	Deleted_At DATE,
	PRIMARY KEY(User_ID)
);