import express from 'express';

import { log } from './utils';
import { getIntentEntity } from './modules/weather';
const router = new express.Router();

router.post('/slack/command/weather', async (req, res) => {
    try {
        const slackReqObj = req.body;
        const LUISResponse = await getIntentEntity(slackReqObj)

        const response = {
            response_type: 'in_channel',
            channel: slackReqObj.channel_id,
            text: LUISResponse,
            attachments: [{
                text: 'Hello, what do you want to know about the weather today',
                fallback: 'Hello, what do you want to know about the weather today',
                color: '#2c963f',
                attachment_type: 'default',
            }],
        };
        return res.json(response);
    } catch (err) {
        log.error(err);
        return res.status(500).send('Something blew up. We\'re looking into it.');
    }
});

export default router;