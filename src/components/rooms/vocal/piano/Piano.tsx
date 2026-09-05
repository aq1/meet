import { Keyboard } from "./Keyboard";
import { usePiano } from "./usePiano";

export const Piano = ({ midi }: { midi?: boolean }) => {
  const onNote = usePiano({ midi });

  return <Keyboard callback={onNote} />;
};
