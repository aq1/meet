export const UPLOAD_KIND_LIST = ["teacher-audio", "avatar"] as const;

export type UploadKindT = (typeof UPLOAD_KIND_LIST)[number];
