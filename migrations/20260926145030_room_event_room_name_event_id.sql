-- +goose Up
delete from "room_event";
alter table "room_event" rename "room_id" to "room_name";
alter table "room_event" add column "event_id" varchar(255) not null unique;

-- +goose Down
alter table "room_event" rename "room_name" to "room_id";
alter table "room_event" drop column "event_id";
