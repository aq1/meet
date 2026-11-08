export const USER_LANG_VALUES = ["ru", "en"] as const;
export type UserLangT = (typeof USER_LANG_VALUES)[number];
