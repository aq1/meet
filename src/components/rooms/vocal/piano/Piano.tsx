import { Keyboard } from "./Keyboard";
import { usePiano } from "./usePiano";

export const Piano = () => {
  const onNote = usePiano();

  return <Keyboard callback={onNote} />;
};
