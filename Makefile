.PHONY: client server

client:
	cd client && bun dev

lint:
	cd server && isort --profile black . && black .

server:
	cd server && fastapi dev

run:
	cd server && fastapi run
