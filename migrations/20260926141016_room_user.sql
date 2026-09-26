-- +goose Up
create table "room_user" (
	id serial primary key,
	room_id integer not null,
	user_id integer not null,
	foreign key (user_id) references "user" (id),
	foreign key(room_id) REFERENCES "room" (id)
);

-- +goose Down
drop table "room_user";
