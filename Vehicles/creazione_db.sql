drop database if exists agenda_db;
create database agenda_db;

use agenda_db;


create table user_profile(
	nome varchar(40),
    cognome varchar(40),
	user_profile varchar(40) PRIMARY KEY,
	pass varchar(255),
    email varchar(255),
    photo varchar(255)
    
);

create table automobile(
	Make_ID integer,
    Make_Name varchar(25),
    Model_ID integer,
    Model_Name varchar(25),
    primary key(Model_Name, Make_Name)
    
);

create table search(
	user_profile varchar(40),
	Make_Name varchar(25),
	Model_Name varchar(25),
    giorno date,
    ora time,
    
    foreign key(user_profile) REFERENCES user_profile(user_profile),
    foreign key(Model_Name, Make_Name) REFERENCES automobile(Model_Name, Make_Name),
    PRIMARY KEY(user_profile, Make_Name, Model_Name)
);

create table favourite_list(
	user_profile varchar(40),
    Make_Name varchar(25),
    Model_Name varchar(25),
    vehicleType varchar(25),
    
    foreign key(user_profile) REFERENCES user_profile(user_profile),
    #foreign key(Model_Name, Make_Name) REFERENCES automobile(Model_Name, Make_Name),

    primary key(user_profile, Make_Name, Model_Name)
);

