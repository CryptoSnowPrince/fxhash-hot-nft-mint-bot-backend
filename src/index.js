import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

function EMPTY(param1, param2, ...param3) {
    return
}

const DEBUG = console.log

const provider = 'https://mainnet.api.tez.ie'

const FX_HASH = process.env.FX_HASH
const PROJECT_ID = process.env.PROJECT_ID
const PRICE = process.env.PRICE
const PRIVATE_KEY = process.env.PRIVATE_KEY

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function buyAndTransfer() {
    const signer = new InMemorySigner(PRIVATE_KEY);
    const tezos = new TezosToolkit(provider)
    tezos.setSignerProvider(signer);

    try {
        DEBUG("    ===Buy START===");
        const contract = await tezos.contract.at(FX_HASH);
        const op = await contract.methods.mint(PROJECT_ID).send({ amount: PRICE })
        await op.confirmation();
        console.info("Purchasing tx:", op.hash, op.includedInBlock);
        DEBUG("    ===Buy END===");
    } catch (ex) {
        DEBUG('Something went wrong!', ex)
    }
}

async function main() {
    while (1) {
        await buyAndTransfer()
        console.info("Please press Ctrl+C to stop purchasing NFT!")
        await delay(3000)
    }
}

main()