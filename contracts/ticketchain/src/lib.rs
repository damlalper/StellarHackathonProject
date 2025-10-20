#![no_std]

use soroban_sdk::{contract, contractimpl, Address, Env, Symbol, symbol_short};

// Storage keys
const KEY_TOTAL: Symbol = symbol_short!("total");
const KEY_LAST: Symbol = symbol_short!("last");

#[contract]
pub struct TicketChainContract;

#[contractimpl]
impl TicketChainContract {
    /// Mint `amount` tickets to `owner`. Updates total supply and last owner.
    pub fn mint_ticket(env: Env, owner: Address, amount: u32) {
        owner.require_auth();

        // Read current total
        let mut total: u32 = env
            .storage()
            .persistent()
            .get::<Symbol, u32>(&KEY_TOTAL)
            .unwrap_or(0);

        total = total.saturating_add(amount);

        // Persist new total and last owner
        let store = env.storage().persistent();
        store.set(&KEY_TOTAL, &total);
        store.set(&KEY_LAST, &owner);
    }

    /// Returns total number of tickets minted so far.
    pub fn get_total_tickets(env: Env) -> u32 {
        env
            .storage()
            .persistent()
            .get::<Symbol, u32>(&KEY_TOTAL)
            .unwrap_or(0)
    }

    /// Returns the last ticket owner's address.
    pub fn get_last_ticket_owner(env: Env) -> Option<Address> {
        env
            .storage()
            .persistent()
            .get::<Symbol, Address>(&KEY_LAST)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn flow() {
        let env = Env::default();
        let contract_id = env.register_contract(None, TicketChainContract);
        let client = TicketChainContractClient::new(&env, &contract_id);

        let user = Address::generate(&env);

        assert_eq!(client.get_total_tickets(), 0);
        assert_eq!(client.get_last_ticket_owner(), None);

        client.with_source_account(&user, || {
            client.mint_ticket(&user, &1u32);
        });

        assert_eq!(client.get_total_tickets(), 1);
        assert_eq!(client.get_last_ticket_owner(), Some(user));
    }
}


