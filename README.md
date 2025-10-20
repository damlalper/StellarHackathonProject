# TicketChain – Web3 Event Ticketing

**TicketChain** is a Web3-based ticketing system that allows event tickets to be created as NFTs on the Stellar network. Each ticket has a unique identity on the blockchain, thus preventing black market sales, counterfeit ticket production, and insecure second-hand transactions.

When users purchase a ticket, it is identified in their NFT wallet, and when they attend the event, they receive attendance badges (POAP-like NFTs).

The project is designed to run on the testnet with a simple frontend interface and Stellar Soroban smart contract integration.

## 🎯 Project Summary

TicketChain is a Web3 solution that makes the ticketing process at physical or digital events secure, transparent, and traceable. Each ticket is created as an NFT, and the ownership, transfer history, and validity of the ticket can be fully verified on the blockchain.

### For Users:

-   Purchase event tickets with their digital wallets
-   Securely sell their tickets second-hand
-   Earn NFT badges from the events they attend to create a participation history on their profile

### For Event Organizers:

-   Control the traceability and limited supply of tickets
-   Prevent black market sales and counterfeit ticket copies

## 📋 Problem Definition

Current ticketing systems face serious black market and counterfeit ticket problems, especially at popular events. The distribution of tickets as PDFs or QR codes leads to their copying and illicit profits.

In addition, second-hand sales are often made through insecure platforms, so users face the risk of fraud.

TicketChain solves these problems:

-   Each ticket is minted as an NFT on the Stellar network
-   Transfer history is traceable on the blockchain
-   Transfers cannot be made without organizer approval
-   Special NFT badges are given to participants

This makes both the authenticity and the ownership status of the tickets verifiable at all times.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Usage](#usage)
- [Smart Contract](#smart-contract)
- [License](#license)

## Features

- **Decentralized Ticket Minting:** Mint tickets securely on the Stellar network.
- **Freighter Wallet Integration:** Easily connect your Freighter wallet to interact with the dApp.
- **Real-time Updates:** View the total number of tickets minted and the last ticket owner in real-time.
- **User-friendly Interface:** A clean and intuitive interface built with Next.js and Tailwind CSS.

## Tech Stack

- **Frontend:**
  - [Next.js](https://nextjs.org/) (with Turbopack)
  - [React](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
- **Blockchain:**
  - [Stellar](https://www.stellar.org/)
  - [Soroban](https://soroban.stellar.org/)
- **Wallet:**
  - [Freighter](https://www.freighter.app/)

## Project Structure

```
ticketchain-dapp/
├── contracts/
│   └── ticketchain/
│       ├── src/
│       │   └── lib.rs      # Soroban smart contract in Rust
│       └── Cargo.toml
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── soroban/
│   │   │       └── route.ts  # Backend API for Soroban interaction
│   │   ├── main/
│   │   │   └── page.tsx      # Main application page for minting tickets
│   │   ├── layout.tsx
│   │   └── page.tsx        # Home page for wallet connection
│   └── lib/
│       └── soroban.ts      # Client-side Soroban helper functions
├── next.config.ts
├── package.json
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [Rust](https://www.rust-lang.org/tools/install)
- [Stellar CLI](https://github.com/stellar/stellar-cli)
- [Freighter Wallet](https://www.freighter.app/) browser extension

## Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/ticketchain-dapp.git
    cd ticketchain-dapp
    ```

2.  **Install dependencies:**

    The necessary dependencies can be installed with `npm install`.

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add your Soroban contract ID:

    ```
    NEXT_PUBLIC_SOROBAN_CONTRACT_ID=YOUR_CONTRACT_ID
    ```

4.  **Run the development server:**

    You can run the development server with `npm run dev` or `npx next dev`.

    ```bash
    npm run dev
    ```
    or
    ```bash
    npx next dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1.  **Connect your wallet:**
    -   Click on the "Connect Freighter" button on the home page.
    -   Authorize the connection in the Freighter wallet pop-up.

2.  **Mint tickets:**
    -   You will be redirected to the main application page after connecting your wallet.
    -   Enter the desired amount of tickets to mint.
    -   Enter the recipient's wallet address (optional, defaults to your own address).
    -   Click the "Mint Ticket" button.
    -   Sign the transaction in the Freighter wallet pop-up.

3.  **View ticket information:**
    -   The total number of tickets minted and the address of the last ticket owner will be displayed on the page.

## Smart Contract

The Soroban smart contract is written in Rust and is located in `contracts/ticketchain/src/lib.rs`.

### Functions

-   `mint_ticket(owner: Address, amount: u32)`: Mints the specified amount of tickets to the owner.
-   `get_total_tickets() -> u32`: Returns the total number of tickets minted.
-   `get_last_ticket_owner() -> Option<Address>`: Returns the address of the last ticket owner.

### Deployment

To deploy the smart contract to the Stellar Testnet, you can use the `stellar-cli`. The following command is an example of how to deploy the contract:

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/ticketchain.wasm \
  --source YOUR_ACCOUNT \
  --network testnet
```

For more detailed instructions, refer to the `StellarDeploy.md` file.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.