START TRANSACTION;
BEGIN;



delete from message;
delete from contact;
delete from user;

insert into user(nickname, first_name, last_name, email, password) values ('srini', 'Srinivasan', 'Manikantan', 'srini@telecomitalia.it', 'srini');  -- id=1
insert into user(nickname, first_name, last_name, email, password) values ('iban', 'Ivan', 'Riva', 'iban@telecomitalia.it', 'iban');               -- id=2
insert into user(nickname, first_name, last_name, email, password) values ('realmat', 'Mattia', 'Reali', 'realmat@telecomitalia.it', 'realmat');         -- id=3
insert into user(nickname, first_name, last_name, email, password) values ('angian', 'Andrea', 'Giancola', 'angian@telecomitalia.it', 'angian');       -- id=4

insert into message(from_id, to_id, body) values(4, 2, 'Cornuto!');
insert into message(from_id, to_id, body) values(2, 1, 'Hai fatturato oggi?');
insert into message(from_id, to_id, body) values(3, 4, 'Brazzers!');


insert into contact(owner_id, contact_id, favorite) values(4, 2, true);
insert into contact(owner_id, contact_id, favorite) values(4, 3, true);
insert into contact(owner_id, contact_id, favorite) values(4, 1, false);
insert into contact(owner_id, contact_id, favorite) values(1, 2, true);
insert into contact(owner_id, contact_id, favorite) values(2, 1, true);
insert into contact(owner_id, contact_id, favorite) values(3, 4, true);
insert into contact(owner_id, contact_id, favorite) values(3, 2, false);

COMMIT;
