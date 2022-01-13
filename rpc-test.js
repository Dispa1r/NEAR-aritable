const { keyStores, KeyPair } = require("near-api-js");
const nearAPI = require("near-api-js");
const Big = require("big-js");
const fs = require("fs");
const toNear = (value = '0') => Big(value).times(10 ** 24).toFixed();
const NETWORK_ID = "testnet";

const keyStore = new keyStores.InMemoryKeyStore();
const KEY_PATH = './dispa1r.testnet.json';
const credentials = JSON.parse(fs.readFileSync(KEY_PATH));
keyStore.setKey(NETWORK_ID, "dispa1r.testnet", KeyPair.fromString(credentials.private_key));

const { connect } = nearAPI;
const config = {
    networkId: "testnet",
    keyStore, // optional if not signing transactions
    nodeUrl: "https://near-testnet--rpc.datahub.figment.io/apikey/b8b1baed81239e1f58cd46f47b27522d",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
};



async function withDrawMoney(new_account_id, num) {
    const deposit = toNear(num);
    const near = await connect(config);
    const account = await near.account("dispa1r.testnet");
    await account.sendMoney(
        new_account_id, // receiver account
        deposit // amount in yoctoNEAR
    );
}

withDrawMoney("dispa1r1.testnet", 1);