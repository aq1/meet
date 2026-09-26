-- +goose Up
delete from "room" where created_by is null;
alter table "room" alter column "created_by" set not null;

-- +goose Down
alter table "room" alter column "created_by" set null;
