import { env } from "#/env";

type NotifyAdminsT = { text: string };

export const notifyAdmins = async ({ text }: NotifyAdminsT) => {
  env.TELEGRAM_ADMINS.forEach(async (chatId) => {
    const data = {
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    };

    const res = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    console.log(`${res.status} ${await res.text()}`);
  });
};
