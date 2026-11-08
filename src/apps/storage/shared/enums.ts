export const FILE_KIND_VALUES = ["teacher-audio", "avatar"] as const;
export type FileKindT = (typeof FILE_KIND_VALUES)[number];

export const FILE_STATUS_VALUES = ["created", "uploaded"] as const;
export type FileStatusT = (typeof FILE_STATUS_VALUES)[number];
