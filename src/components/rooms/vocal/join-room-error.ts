import { ROOM_NOT_FOUND_ERROR } from "@/apps/rooms/shared/errors";

export type JoinRoomStage = "auth" | "token" | "connect";

export class JoinRoomError extends Error {
  stage: JoinRoomStage;

  constructor(stage: JoinRoomStage, cause: unknown) {
    const reason = cause instanceof Error ? cause.message : String(cause);
    super(`Join room failed at "${stage}": ${reason}`, { cause });
    this.name = "JoinRoomError";
    this.stage = stage;
  }
}

export async function joinStage<T>(stage: JoinRoomStage, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    throw new JoinRoomError(stage, error);
  }
}

export function isRoomNotFoundError(error: unknown) {
  return error instanceof JoinRoomError && error.cause instanceof Error && error.cause.message === ROOM_NOT_FOUND_ERROR;
}
