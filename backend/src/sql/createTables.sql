-- username is choosen as primary key of the relation since it is the only primary key.
CREATE TABLE Users(username VARCHAR(30),
    name VARCHAR(30),
    password VARCHAR(10),
    surname VARCHAR(30),
    PRIMARY KEY (username));
-- Create table for audiences relation. This relation represents audiences entity set in ER diagram.
-- username is choosen as primary key of the relation since it is the only primary key.
-- username also refers to superclass Users
CREATE TABLE Audiences(username VARCHAR(30),
    PRIMARY KEY (username),
	FOREIGN KEY (username) REFERENCES Users
		ON DELETE CASCADE);
-- Create table for rating_platforms relation. This relation represents Rating Platforms entity set in ER diagram.
-- platform_id and platform_name attributes are unique. platform_id is choosen as primary key.
CREATE TABLE Rating_Platforms(platform_name VARCHAR(30),
	platform_id INTEGER,
    PRIMARY KEY (platform_id),
	UNIQUE (platform_name));
-- Create table for subscriptions relation.
-- This relation represents subscriptions relationship set between audiences and platforms in ER diagram.
-- Primary key is made of username and platform_id since these attributes generates minimum unique set of attributes.
CREATE TABLE Subscriptions(username VARCHAR(30),
	platform_id INTEGER,
	PRIMARY KEY (username, platform_id),
	FOREIGN KEY (username) REFERENCES Audiences
		ON DELETE CASCADE,
	FOREIGN KEY (platform_id) REFERENCES Rating_Platforms
		ON DELETE CASCADE);
	
-- Create table for directors relation.
-- This relation represents directors entity in ER diagram.
-- username is choosen as primary key since it is the only unique attribute.
-- username also refers to superclass Users
-- platform_id refers to platform with that the director has agreement. 
-- This situation is represented with agreements relationship set in ER diagram.
-- Nation of a director can not be null since it is a must in the project description.
CREATE TABLE Directors(username VARCHAR(30),
	nation VARCHAR(30) NOT NULL,
	platform_id INTEGER,
    PRIMARY KEY (username),
	FOREIGN KEY (username) REFERENCES Users
		ON DELETE CASCADE,
	FOREIGN KEY (platform_id) REFERENCES Rating_Platforms
		ON DELETE SET NULL);
-- Create table for theatres relation.
-- This relation represents theatres entity in ER diagram.
-- theatre_id is choosen as primary key since it is the only unique attribute.
CREATE TABLE Theatres(
	theatre_id INTEGER,
	theatre_name VARCHAR(50),
	theatre_district VARCHAR(50),
	theatre_capacity INTEGER,
	PRIMARY KEY(theatre_id)
);
-- Create table for genres relation.
-- genre_id and genre_name are unique. We selected genre_id as primary key. genre_name is candidate key
CREATE TABLE Genres(
	genre_id INTEGER,
	genre_name VARCHAR(50),
	UNIQUE(genre_name),
	PRIMARY KEY(genre_id)
);

-- Create table for movies relation
-- movies table represents the movies entity set in the ER diagram
-- movie_id is unique and it is selected as primary key.
-- director_username refers to the director who is the director of the movie
CREATE TABLE MOVIES(movie_id INTEGER,
	movie_name VARCHAR(30),
	average_Rating REAL,
	duration INTEGER,
	director_username VARCHAR(30) NOT NULL,
    PRIMARY KEY (movie_id),
	FOREIGN KEY (director_username) REFERENCES Directors(username)
		ON DELETE CASCADE);

-- Create table for Movie Sessions relation
-- Represents mmovie sessions entity set in ER diagram
-- session_id is unique and it is selected as primary key
-- movie_id refers to the id of the movie that is shown in that session
-- This situation is represented with Has_Movie relationship set in ER diagram
-- theatre_id refers to the theatre that the movie session will be shown
-- This situation is represented with Has_Theatre relationship set in ER diagram
-- the combination of theatre_id, date, time_slot should be unique as stated in the project description
CREATE TABLE MOVIE_SESSIONS(session_id INTEGER,
	time_slot INTEGER,
	date DATE,
	movie_id INTEGER NOT NULL,
	theatre_id INTEGER NOT NULL,
    PRIMARY KEY (session_id),
	FOREIGN KEY (movie_id) REFERENCES Movies
		ON DELETE CASCADE,
	FOREIGN KEY (theatre_id) REFERENCES Theatres
		ON DELETE CASCADE,
	UNIQUE(theatre_id, date, time_slot),
	CHECK (time_slot >= 1 AND time_slot <=4)
);

-- Create table for Has_genre relation 
-- This relation represents Has Genre relationship set between movies and genres entity sets in the ER diagram
-- combination of movie_id and genre_id is unique and it is forced to select as primary key
-- movie_id refers to a movie entity and genre_id refers to a genre entity
CREATE TABLE Has_Genre(
	movie_id INTEGER,
	genre_id INTEGER,
	PRIMARY KEY(movie_id, genre_id),
	FOREIGN KEY(movie_id) REFERENCES Movies
		ON DELETE CASCADE,
	FOREIGN KEY(genre_id) REFERENCES Genres
		ON DELETE CASCADE
);

-- Create table for ratings relation
-- This relation represents Ratings relationship set in ER diagram
-- Combination of movie_id and username attributes is the primary key
-- movie_id refers to a movies entity and username refers to an audiences entity.
CREATE TABLE Ratings(
	movie_id INTEGER,
	username VARCHAR(50),
	rating REAL,
	PRIMARY KEY(movie_id, username),
	FOREIGN KEY(movie_id) REFERENCES Movies
		ON DELETE CASCADE,
	FOREIGN KEY(username) REFERENCES Audiences
		ON DELETE CASCADE,
	CHECK (rating >= 0 AND rating <= 5)
);

-- Create table for Database_Managers relation
-- This relation represents Database_Managers entity sey in ER diagram
-- username is choosen as primary key
CREATE TABLE Database_Managers(
	username VARCHAR(50),
	password VARCHAR(50),
	PRIMARY KEY(username)
);
-- Create table for Precedes relation
-- This relation represents Precedes relationship set in ER diagram
-- predecessor_movie_id refers to predecessor movie entity and ancestor_movie_id refers to ancestor movie
-- Combination of these two fields is the primary key.
CREATE TABLE Precedes(
	predecessor_movie_id INTEGER,
	ancestor_movie_id INTEGER,
	PRIMARY KEY(predecessor_movie_id,ancestor_movie_id),
	FOREIGN KEY(ancestor_movie_id) REFERENCES Movies
		ON DELETE CASCADE,
	FOREIGN KEY(predecessor_movie_id) REFERENCES Movies
		ON DELETE CASCADE
);
-- Create table for Ticktes relation
-- This relation represents Tickets relationship set in ER diagram
-- username refers to user that bought ticket and session_id refers to movie for that bought ticket
CREATE TABLE Tickets(username VARCHAR(30),
    session_id INTEGER,
    PRIMARY KEY (username, session_id),
	FOREIGN KEY (username) REFERENCES Audiences
		ON DELETE CASCADE,
	FOREIGN KEY (session_id) REFERENCES Movie_Sessions
		ON DELETE CASCADE
);

INSERT INTO Rating_Platforms (platform_id, platform_name) VALUES (10130, 'IMDB');
INSERT INTO Rating_Platforms (platform_id, platform_name) VALUES (10131, 'Letterboxd');
INSERT INTO Rating_Platforms (platform_id, platform_name) VALUES (10132, 'FilmIzle');
INSERT INTO Rating_Platforms (platform_id, platform_name) VALUES (10133, 'Filmora');
INSERT INTO Rating_Platforms (platform_id, platform_name) VALUES (10134, 'BollywoodMDB');




INSERT INTO Genres (genre_id, genre_name) VALUES (80001, 'Animation');
INSERT INTO Genres (genre_id, genre_name) VALUES (80002, 'Comedy');
INSERT INTO Genres (genre_id, genre_name) VALUES (80003, 'Adventure');
INSERT INTO Genres (genre_id, genre_name) VALUES (80004, 'Real Story');
INSERT INTO Genres (genre_id, genre_name) VALUES (80005, 'Thriller');
INSERT INTO Genres (genre_id, genre_name) VALUES (80006, 'Drama');



INSERT INTO Database_Managers (username, password) VALUES ('manager1', 'managerpass1');
INSERT INTO Database_Managers (username, password) VALUES ('manager2', 'managerpass2');
INSERT INTO Database_Managers (username, password) VALUES ('manager35', 'managerpass35');

INSERT INTO Users (username, name, password, surname) VALUES ('steven.jobs', 'Steven', 'apple123', 'Jobs');
INSERT INTO Audiences (username) VALUES ('steven.jobs');

INSERT INTO Users (username, name, password, surname) VALUES ('minion.lover', 'Felonius', 'bello387', 'Gru');
INSERT INTO Audiences (username) VALUES ('minion.lover') ;

INSERT INTO Users (username, name, password, surname) VALUES ('egemen.isguder', 'Egemen', 'deneme124', 'Isguder');
INSERT INTO Audiences (username) VALUES ('egemen.isguder') ;

INSERT INTO Rating_Platforms (platform_id, platform_name) VALUES (10130, 'IMDB');
INSERT INTO Rating_Platforms (platform_id, platform_name) VALUES (10131, 'Letterboxd');

INSERT INTO Subscriptions (username, platform_id) VALUES ('steven.jobs', 10130);
INSERT INTO Subscriptions (username, platform_id) VALUES ('steven.jobs', 10131);
INSERT INTO Subscriptions (username, platform_id) VALUES ('minion.lover', 10131);

INSERT INTO Users (username) VALUES ('he.gongmin');
INSERT INTO Directors (username, nation, platform_id) VALUES ('he.gongmin', 'Turkish', 10130);

INSERT INTO Users (username) VALUES ('kron.helene');
INSERT INTO Directors (username, nation, platform_id) VALUES ('kron.helene', 'French', 10131);

INSERT INTO Users (username) VALUES ('kyle.balda');
INSERT INTO Directors (username, nation, platform_id) VALUES ('kyle.balda', 'German', 10131);

INSERT INTO Theatres (theatre_id, theatre_name, theatre_capacity, theatre_district) VALUES (40001, 'Sisli_1', 300, 'Sisli');
INSERT INTO Theatres (theatre_id, theatre_name, theatre_capacity, theatre_district) VALUES (40003, 'Besiktas1', 100, 'Besiktas');
INSERT INTO Theatres (theatre_id, theatre_name, theatre_capacity, theatre_district) VALUES (40004, 'Besiktas2', 100, 'Besiktas');


INSERT INTO Genres (genre_id, genre_name) VALUES (80001, 'Animation');
INSERT INTO Genres (genre_id, genre_name) VALUES (80002, 'Comedy');

INSERT INTO Movies (movie_id, movie_name, average_Rating, duration, director_username) VALUES (20001, 'Despicable Me', 5,2, 'kyle.balda');
INSERT INTO Movies (movie_id, movie_name, average_Rating, duration, director_username) VALUES (20005, 'Minions: The Rise of Gru', 5,1, 'kyle.balda');

INSERT INTO Movie_Sessions (session_id, movie_id, theatre_id, time_slot, date) VALUES (50001,20001,40001,1,'2023-03-15');
INSERT INTO Movie_Sessions (session_id, movie_id, theatre_id, time_slot, date) VALUES (50008,20005,40004,1,'2023-03-15');

INSERT INTO Has_Genre (movie_id, genre_id) VALUES (20001, 80002);
INSERT INTO Has_Genre (movie_id, genre_id) VALUES (20001, 80001);
INSERT INTO Has_Genre (movie_id, genre_id) VALUES (20005, 80002);
INSERT INTO Has_Genre (movie_id, genre_id) VALUES (20005, 80001);

INSERT INTO Ratings (username, movie_id, rating) VALUES ('egemen.isguder', 20001, 5);
INSERT INTO Ratings (username, movie_id, rating) VALUES ('egemen.isguder', 20005, 5);

INSERT INTO Database_Managers (username, password) VALUES ('manager1', 'managerpass1');

INSERT INTO Precedes (predecessor_movie_id, ancestor_movie_id) VALUES (20001, 20005);

INSERT INTO Tickets (username, session_id) VALUES ('steven.jobs', 50001);
INSERT INTO Tickets (username, session_id) VALUES ('egemen.isguder', 50008);