START TRANSACTION;
BEGIN;



delete from message;
delete from contact;
delete from user;

insert into user(nickname, first_name, last_name, email, password) values ('srini', 'Srinivasan', 'Manikantan', 'srini@gmail.com', 'srini');  -- id=1
insert into user(nickname, first_name, last_name, email, password) values ('iban', 'Ivan', 'Riva', 'iban@gmail.com', 'iban');               -- id=2
insert into user(nickname, first_name, last_name, email, password) values ('realmat', 'Mattia', 'Reali', 'realmat@gmail.com', 'realmat');         -- id=3
insert into user(nickname, first_name, last_name, email, password) values ('angian', 'Andrea', 'Giancola', 'angian@gmail.com', 'angian');       -- id=4

insert into message(from_id, to_id, body) values(4, 2, 'Cornuto!');
insert into message(from_id, to_id, body) values(2, 1, 'Hai fatturato oggi?');
insert into message(from_id, to_id, body) values(3, 4, 'Brazzers!');


insert into contact(owner_id, contact_id, favorite, blacklisted) values(4, 2, true, false);
insert into contact(owner_id, contact_id, favorite, blacklisted) values(4, 3, true, false);
insert into contact(owner_id, contact_id, favorite, blacklisted) values(4, 1, false, false);
insert into contact(owner_id, contact_id, favorite, blacklisted) values(1, 2, true, false);
insert into contact(owner_id, contact_id, favorite, blacklisted) values(2, 1, true, false);
insert into contact(owner_id, contact_id, favorite, blacklisted) values(3, 4, true, false);
insert into contact(owner_id, contact_id, favorite, blacklisted) values(3, 2, false, false);

COMMIT;
