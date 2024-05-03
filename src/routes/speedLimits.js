/* istanbul ignore file */
/**
 * @swagger
 * components:
 *  schemas:
 *    SpeedLimit:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: Unique name for the Domain
 *        displayName:
 *          type: object
 *          properties: 
 *            text: string
 *            languageCode: string
 *        location:
 *          type: object
 *          properties:
 *            latitude: number
 *            longitude: number
 *      example:
 *         name: ATT_RFDS_existing
 *         description: ATT RFDS Domain for existing layouts
 */
const express = require('express');
const {
    SpeedLimitsController
} = require('../controllers/speedLimitController');
const controller = new SpeedLimitsController();

const router = new express.Router();

/**
/**
 * @swagger
 * /speedLimits:
 *  get:
 *    summary: Get a location
 *    tags: [SpeedLimit]
 *    parameters:
 *       - in: query
 *         name: latitue
 *         style: form
 *         explode: true
 *         schema:
 *          type: string
 *         required: true
 *         description: The name of location
 *       - in: query
 *         name: longitude
 *         style: form
 *         explode: true
 *         schema:
 *          type: string
 *         required: true
 *         description: The name of location
 *    responses:
 *      200:
 *           description: List of Domains with their name and description
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SpeedLimit'
 *      401:
 *           description: UnAuthorized
 *      404:
 *           description: No Domains found
 *      500:
 *           description: Internal server error
 *    security:
 *      - default:
 *          - SOAP-BASE
 *          - SOAP-SCOPE
 *          - DSI-FID-P
 *          - DSI-FID-R
 *          - DSI-FID-W
 *          - MANA-DSI-SOAP-ATT
 *          - MANA-DSI-SOAP-TMO
 *    x-throttling-tier: Unlimited
 *    x-auth-type: Application & Application User
 *    x-wso2-application-security:
 *      security-types:
 *        - oauth2
 *      optional: false
 *
 */
router.get('/', async (req, res) => {
    controller.getSpeedLimits(req, res);
});

module.exports = router;
