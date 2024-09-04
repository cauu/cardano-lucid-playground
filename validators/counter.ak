use aiken/transaction.{Datum, Redeemer, ScriptContext, InlineDatum, Spend, find_input}
use aiken/list

type CountDatum {
    count: Int
}

// 1. create a utxo with a datum of count 0
// 2. when spending, only allow the next utxo with same address and count + 1
validator {
    fn plus(
        datum: CountDatum,
        redeemer: Redeemer,
        context: ScriptContext
    ) -> Bool {
        let ScriptContext { transaction, purpose } = context
        expect Spend(spend_utxo_reference) = purpose
        expect Some(input) = find_input(transaction.inputs, spend_utxo_reference)

        expect InlineDatum(maybe_prev_count_datum) = input.output.datum
        expect prev_count_datum: CountDatum = maybe_prev_count_datum

        let count_script_address = input.output.address

        // is it possible that one  transactions outputs have multiple utxo with
        // the same address?
        expect Some(output) = transaction.outputs
            |> list.filter(fn (output) {
                output.address == count_script_address
            })
            |> list.head()

        expect InlineDatum(maybe_next_count_datum) = output.datum
        expect next_count_datum: CountDatum = maybe_next_count_datum

        next_count_datum.count == prev_count_datum.count + 1
    }
}