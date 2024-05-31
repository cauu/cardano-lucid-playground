import { Lucid } from '@cauu/lucid-cardano';

import { HelloWordHelloWorld } from '../plutus';

export function collectValidators(lucid: Lucid) {
  const helloWord = new HelloWordHelloWorld();

  return {
    helloWord
  };
}
