type TextMessageT = { payload: { text: string } };
export const TextMessage = ({ payload }: TextMessageT) => {
  return <p>{payload.text}</p>;
};
