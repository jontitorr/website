import { Input as NextUIInput } from "@nextui-org/react";
import { useState } from "react";

import type { FormElement, InputProps as Props } from "@nextui-org/react";

type OptionalProps = {
  [K in keyof Props]?: Props[K];
};

type InputProps = OptionalProps & {
  doneTypingInterval?: number;
  startedTyping?: React.KeyboardEventHandler<FormElement>;
  stoppedTyping?: React.KeyboardEventHandler<FormElement>;
};

export default function Input({ doneTypingInterval, startedTyping, stoppedTyping, ...args }: InputProps) {
  const [typingTimer, setTypingTimer] = useState({} as NodeJS.Timeout);

  const doneTyping = (e: React.KeyboardEvent<FormElement>) => {
    stoppedTyping && stoppedTyping(e);
  };

  const typing = (e: React.KeyboardEvent<FormElement>) => {
    e.preventDefault();

    startedTyping && startedTyping(e);

    clearTimeout(typingTimer);
    setTypingTimer(setTimeout(doneTyping, doneTypingInterval || 1000, e));
  };

  return <NextUIInput onKeyDown={startedTyping} onKeyUp={typing} {...args} />;
}
