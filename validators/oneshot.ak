// use aiken/dict
// use aiken/list
use aiken/transaction.{Mint, OutputReference, ScriptContext, Transaction}
// use aiken/transaction/value
 
type Action {
  CheckMint
  CheckBurn
}
 
validator(token_name: ByteArray, utxo_ref: OutputReference) {
  fn gift_card(rdmr: Action, ctx: ScriptContext) -> Bool {
    let ScriptContext { transaction, purpose } = ctx
 
    expect Mint(policy_id) = purpose
 
    let Transaction { inputs, mint, .. } = transaction
 
    // expect [Pair(asset_name, amount)] =
    //   mint
    //     |> value.from_minted_value
    //     |> value.tokens(policy_id)
    //     |> dict.to_pairs()
 
    when rdmr is {
      CheckMint -> {
        True 
        // expect Some(_input) =
        //   list.find(inputs, fn(input) { input.output_reference == utxo_ref })
        // amount == 1 && asset_name == token_name
      }
      CheckBurn -> True
        // amount == -1 && asset_name == token_name
    }
  }
}