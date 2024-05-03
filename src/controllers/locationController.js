
const {
    NOT_FOUND,
    BAD_REQUEST,
    OK
} = require('../utils/codes');
const {
    hasCustomers, isValidCustomer
} = require('../utils/validations');
const { Client } = require("@googlemaps/google-maps-services-js");

const client = new Client({});
const apiKey = process.env.GOOGLE_MAPS_API_KEY ?? 'AIzaSyA3-lJsg9xH64HFlCJjsEaXUvHCdC4_9Zk';

/**DomainController is the class which will handle all the logic operation for Domain*/
class LocationController {

    async getLocation(req, res) {
        // if (!hasCustomers(res)) {
        //     res.status(BAD_REQUEST).send('No customer role found');
        //     return;
        // }

        let result = {};
        client
            .textSearch({
                params: {
                    query: "Nizampura",
                    key: apiKey
                },
                timeout: 100000
            })
            .then((r) => {
                result = r.data.results;
                console.log(r.data.results[0].elevation);
                res.status(OK).send(result);
            })
            .catch((e) => {
                console.log(e.response.data.error_message);
                res.status(NOT_FOUND).send({
                    "message": e.response.data.error_message
                });
            });
    }
}

module.exports = { LocationController };
