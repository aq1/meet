-- +goose Up
alter table "room"
  add column finished_at timestamptz NULL,
  add column egress_url text default '';

-- +goose Down
alter table "room"
  drop column finished_at,
  drop column egress_url;
