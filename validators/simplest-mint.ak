use aiken/transaction.{Redeemer, ScriptContext}

// @doc https://piefayth.github.io/blog/pages/aiken1/
validator {
  fn simplest_mint(_rdmr: Redeemer, _ctx: ScriptContext) -> Bool {
    True
  }
}
