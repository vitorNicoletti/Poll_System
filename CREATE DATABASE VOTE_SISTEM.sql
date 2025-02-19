DROP DATABASE IF EXISTS vote_sistem ;
CREATE DATABASE vote_sistem;
USE vote_sistem;
CREATE TABLE polls(
	id INT auto_increment PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    start_date datetime NOT NULL,
    end_date datetime NOT NULL

);

CREATE TABLE options(
	id INT auto_increment PRIMARY KEY,
    option_text varchar(100) NOT NULL,
    id_poll INT NOT NULL,
    FOREIGN KEY (id_poll) REFERENCES polls(id) ON DELETE CASCADE 
);

