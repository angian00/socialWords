START TRANSACTION;
BEGIN;

ALTER TABLE message DROP FOREIGN KEY fk_from_id;
ALTER TABLE message DROP FOREIGN KEY fk_to_id;
ALTER TABLE contact DROP FOREIGN KEY fk_owner_id;
ALTER TABLE contact DROP FOREIGN KEY fk_contact_id;


DROP TABLE IF EXISTS user;
CREATE TABLE user (
	id BIGINT NOT NULL AUTO_INCREMENT,
	nickname CHAR(20) NOT NULL UNIQUE,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	password VARCHAR(20) NOT NULL,
	last_login_ts TIMESTAMP,

	PRIMARY KEY (id)
);


DROP TABLE IF EXISTS message;
CREATE TABLE message (
	id BIGINT NOT NULL AUTO_INCREMENT,
	from_id BIGINT NOT NULL,
	to_id BIGINT NOT NULL,
	body VARCHAR(500) NOT NULL,
	sent_ts TIMESTAMP,
	read_ts TIMESTAMP,

	PRIMARY KEY (id),
	CONSTRAINT fk_from_id FOREIGN KEY (from_id) REFERENCES user(id),
	CONSTRAINT fk_to_id FOREIGN KEY (to_id) REFERENCES user(id)
);

DROP TABLE IF EXISTS contact;
CREATE TABLE contact (
	owner_id BIGINT NOT NULL,
	contact_id BIGINT NOT NULL,
	blacklisted BOOLEAN,
	favorite BOOLEAN,
	added_ts TIMESTAMP,
	notes	VARCHAR(200),

	PRIMARY KEY (owner_id, contact_id),
	CONSTRAINT fk_owner_id FOREIGN KEY (owner_id) REFERENCES user(id),
	CONSTRAINT fk_contact_id FOREIGN KEY (contact_id) REFERENCES user(id)
);


COMMIT;
