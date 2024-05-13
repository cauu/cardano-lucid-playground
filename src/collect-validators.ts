import { Lucid } from "lucid-cardano";

import { HelloWord } from "../plutus";

export function collectValidators(lucid: Lucid) {
  const helloWord = new HelloWord();

  return {
    helloWord,
  };
}
