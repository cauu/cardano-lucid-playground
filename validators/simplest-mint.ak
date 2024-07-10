use aiken/transaction.{ScriptContext, Redeemer}

validator {
    fn simplest_mint(_rdmr: Redeemer, _ctx: ScriptContext) -> Bool {
        True
    }
}