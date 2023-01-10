DROP DATABASE IF EXISTS secretsanta;

CREATE DATABASE secretsanta;

USE secretsanta;

CREATE TABLE credential (
	credential_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(50),
    p_word VARCHAR(50),
    phone_number VARCHAR(50)
);

CREATE TABLE user (
  user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  credential_id INT NOT NULL,
  is_active BOOLEAN
);

CREATE TABLE wishlist (
	wishlist_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER,
    wishlist_item MEDIUMTEXT
);

CREATE TABLE purchased_item (
	purchased_item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER,
    purchaser_user_id INTEGER,
    purchased_item MEDIUMTEXT
);

CREATE TABLE user_recipient (
	user_id INTEGER,
    recipient_user_id INTEGER
);