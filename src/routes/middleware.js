
// const { decodeStr } = require('@ana-dev/encryption');
const { jwtDecode } = require('jwt-decode');
const ALLOWED_CUSTOMERS = process.env.VALID_CUSTOMERS?.split(',') ?? [];

const commonSecretEncoded = process.env.SECRET;
const numberOfCustomers = parseInt(process.env.NUMBEROFCUSTOMERS ?? '0');
const USER_MAPPING = {};

const getUsers = () => {
    let users = {};
    // let commonSecretDecoded = decodeStr(commonSecretEncoded);
    // let splitDecoded = commonSecretDecoded.split(':');
    // users[splitDecoded[0]] = splitDecoded[1];
    // USER_MAPPING[commonSecretDecoded] = ALLOWED_CUSTOMERS;

    // for (let i = 0; i < numberOfCustomers; i++) {
    //     let encoded = process.env[`CUSTOMER${i + 1}SECRET`];
    //     if (encoded) {
    //         let decodedSecret = decodeStr(encoded);
    //         let splitDecoded = decodedSecret.split(':');
    //         users[splitDecoded[0]] = splitDecoded[1];
    //         USER_MAPPING[decodedSecret] = [process.env[`CUSTOMER${i + 1}`]];
    //     }
    // }
    return users;
};

const dsiAuthorizer = (req, res, next) => {
    res.locals.customers = USER_MAPPING[`${req.auth.user}:${req.auth.password}`];
    next();
};

const jwtDecoder = (header) => {
    return (req, res, next) => {
        if (req.headers[header]) {
            let decoded = jwtDecode(req.headers[header]);
            let scopes = decoded.scope?.split(' ') ?? [];
            // if the user associated with
            // more than one customer
            // hence defines an array
            res.locals.customers = [];
            for (let scope of scopes) {
                // pick-up only customer scopes
                // the pattern is assumed as starting with
                // MANA_DSI_SOAP_{customer[CAPS]}
                let matched = scope.match(/^(MANA[-_]DSI[-_]SOAP[-_])/);
                if (matched && matched[1]) {
                    let customer = scope.replace(matched[1], '');
                    if (ALLOWED_CUSTOMERS.includes(customer)) {
                        res.locals.customers.push(customer);
                    }
                }
            }
        }
        next();
    }
};

const setLocal = () => {
    return (_req, res, next) => {
        res.locals.customers = ALLOWED_CUSTOMERS;
        next();
    }
}

module.exports = {
    dsiAuthorizer,
    jwtDecoder,
    setLocal,
    getUsers
};
