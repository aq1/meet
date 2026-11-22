type TextMessageT = { text: string };

export const TextMessage = ({ text }: TextMessageT) => {
  return <p>{text}</p>;
};
