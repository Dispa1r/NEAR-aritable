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
    nodeUrl: "https://hk.bsngate.com/api/835cc76f817fb0b9b5c995e6eb047ff0c146807eea3e01dcee68ddea8e72cb2e/Near-Testnet/rpc",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
};

async function getContract(viewMethods, changeMethods) {
    const near = await connect(config);
    const tmpAccount = await near.account("dispa1r.testnet");
    const contract = new nearAPI.Contract(tmpAccount, "dev-1640705550201-17220448566506", {
        viewMethods,
        changeMethods,
    })
    return contract
}

function Transfer(timeStamp) {
    var timeStamp1 = new Date(timeStamp); //直接用 new Date(时间戳) 格式转化获得当前时间
    console.log(timeStamp1);
    var result = timeStamp1.toLocaleDateString().replace(/\//g, "-");
    var arr = result.split('-');
    result = arr[2] + '-' + arr[1] + '-' + arr[0];
    console.log(result);
    return result
}

function Transfer1(date) {
    //let start_time  = ;
    var timeStamp = new Date(date).getTime();
    return timeStamp * 1000000;

}

async function callGet(range) {
    const contract = await getContract(['getAll'], ['update', 'add'])
    var resp = await contract.getAll({
        range,
    });
    console.log(resp);
    return resp;
}

async function callAdd(todo, date) {
    const contract = await getContract(['getAll'], ['update', 'add'])
    var resp = await contract.add({
        todo,
        date,
    });
    console.log(resp);
}


//callGet("steve yu")


function TableToContract(range) {
    var Airtable = require('airtable');
    var base = new Airtable({ apiKey: 'keye42A8JyHRZL4k1' }).base('appEsNM54amz2gRzW');

    base('待办事项').select({
        // Selecting the first 3 records in Grid view:
        maxRecords: 3,
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function(record) {
            console.log('Retrieved', record.get('日期'));
            console.log(Transfer1(record.get('日期')))
            callAdd(record.get('ToDo'), Transfer1(record.get('日期')))
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

    }, function done(err) {
        if (err) { console.error(err); return; }
    });


}



async function ContractToTable(id) {

    var tmp = await callGet(id);
    var time = Transfer(((tmp[id].date - tmp[id].date % 1000000) / 1000000));
    console.log(time);
    console.log(tmp[id].todo);

    var Airtable = require('airtable');
    var base = new Airtable({ apiKey: 'keye42A8JyHRZL4k1' }).base('appEsNM54amz2gRzW');

    base('待办事项').create([{
        "fields": {
            "日期": time,
            "ToDo": tmp[id].todo,
            "Field 6": {
                "id": "usrpffISGgSlYnS3L",
                "email": "lrj001228@gmail.com",
                "name": "Draven Lu"
            }
        }
    }], function(err, records) {
        if (err) {
            console.error(err);
            return;
        }
        records.forEach(function(record) {
            console.log(record.getId());
        });
    });


}

const { getData } = require('./sheet.js');

(async() => {
    const resp = await getData('174epQEZjLozxRjM0dLW-7HR3XXpUS0R_chS-Co4017c', '1386834576');
    console.log(resp);
})();


// TableToContract();
// ContractToTable("Disp41r")

//ContractToTable("Disp41r");

//callAdd("geek",Transfer1("2022-12-08 12:50:30"))
//ContractToTable(1)
//TableToContract(2);
ContractToTable(1);