import { Lucid } from 'lucid-cardano';

import { HelloWordHelloWorld } from '@/plutus';

export function collectValidators(lucid: Lucid) {
  const helloWord = new HelloWordHelloWorld();

  return {
    helloWord
  };
}
