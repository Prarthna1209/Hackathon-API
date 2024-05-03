
const {
    NOT_FOUND,
    BAD_REQUEST,
    OK
} = require('../utils/codes');
const {
    hasCustomers, isValidCustomer
} = require('../utils/validations');
const { Client } = require("@googlemaps/google-maps-services-js");
const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');

const axios = require('axios');

const YOUR_APP_ID = process.env.HERE_API_ID ?? 'wYlqfuFkR2DmLF7lDsBL';
const YOUR_APP_CODE = process.env.HERE_API_KEY ?? 'yQe4LgxraMygEEgvZAOUnbhWlzBUO5XvP_yfaun0Wm4';

const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform',
});

// const roadsService = google.roadsService({ version: 'v1', auth });

const getSpeedLimits = async () => {
    const res = await roadsService.speedLimits.get({
        placeId: 'ChIJkaxY0u1uEmsR55j03e0p0mY',
    });
    console.log(res.data);
};

const client = new Client({});
const apiKey = process.env.GOOGLE_MAPS_API_KEY ?? 'AIzaSyA3-lJsg9xH64HFlCJjsEaXUvHCdC4_9Zk';

/**DomainController is the class which will handle all the logic operation for Domain*/
class SpeedLimitsController {

    async getSpeedLimits(req, res) {
        // if (!hasCustomers(res)) {
        //     res.status(BAD_REQUEST).send('No customer role found');
        //     return;
        // }
        let { latitude, longitude, placeId } = req.query;
        try {
            // Reverse Geocoding to get address information
            const reverseGeocodeResponse = await axios.get(
                `https://reverse.geocoder.cit.api.here.com/6.2/reversegeocode.json?app_id=${YOUR_APP_ID}&app_code=${YOUR_APP_CODE}&prox=${latitude},${longitude}&mode=retrieveAddresses&maxResults=1&additionaldata=SuppressStreetType,Unnamed&locationattributes=linkInfo`
            );

            const address = reverseGeocodeResponse.data.Response.View[0].Result[0].Location.Address;
            const road = address.Road || address.Street; // Assuming road name is in Road or Street

            if (!road) {
                throw new Error('No road found for given coordinates');
            }

            // Snap to Roads to get closest road segment details
            const snapToRoadsResponse = await axios.get(
                `https://router.hereapi.com/v8/routes?apiKey=${YOUR_APP_CODE}&mode=driving;fast&waypoint0=${latitude},${longitude}&waypoint1=${latitude},${longitude}&linkattributes=speedlimit`
            );

            const snappedWaypoints = snapToRoadsResponse.data.routes[0].links;
            const speedLimit = snappedWaypoints[0].attributes.speedlimit; // Assuming speed limit is in the first snapped segment

            let result = { road, speedLimit };
            res.status(OK).send(result);
        } catch (error) {
            console.error(error);
            res.status(NOT_FOUND).send({
                "message": error
            });
        }

    }
}

module.exports = { SpeedLimitsController };
