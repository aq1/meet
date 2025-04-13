import socketio

from pydantic import BaseModel

sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=[]
)

sio_app = socketio.ASGIApp(
    socketio_server=sio,
    socketio_path='ws'
)


@sio.event
async def join(sid: str, room: str):
    await sio.enter_room(sid, room)


@sio.event
async def leave(sid: str, room: str):
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
