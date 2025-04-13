from pydantic import BaseModel
import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=[])
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

socket_app = socketio.ASGIApp(sio, app)


@sio.event
async def join(sid: str, room: str):
    await sio.enter_room(sid, room)


@sio.event
async def leave(sid: str, room: str):
    print(type(sid))
    await sio.leave_room(sid, room)


class Note(BaseModel):
    octave: int
    note: str


@sio.event
async def note_down(sid: str, room: str, note: Note):
    await sio.emit("note_down", data=note, room=room, skip_sid=sid)


@sio.event
async def note_up(sid: str, room: str, note: Note):
    await sio.emit("note_up", data=note, room=room, skip_sid=sid)


app.mount("/", socket_app)
