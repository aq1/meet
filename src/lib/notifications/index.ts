import { env } from "#/env";

type NotifyAdminsT = { text: string };

export const notifyAdmins = async ({ text }: NotifyAdminsT) => {
  env.TELEGRAM_ADMINS.forEach(async (chat_id) => {
    const data = {
      chat_id,
      text,
      disable_web_page_preview: true,
    };

    const res = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`,
      { method: "POST", body: JSON.stringify(data) },
    );

    if (!res.ok) {
      throw new Error(`${res.status} ${await res.text()}`);
    }
  });
};
