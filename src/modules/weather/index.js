let rp = require('request-promise');
export const getIntentEntity = async (slackReqBody) => {
    try {
        var options = {
            uri: 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/85e0bf62-1ab5-4cb4-96c0-75684bc159ee',
            qs:
            {
                verbose: 'true',
                timezoneOffset: '-360',
                'subscription-key': '83ed2e2977d74784958887cff15097bc',
                q: slackReqBody.text
            },
        };
        return new Promise((resolve, reject) => {
            rp(options)
                .then(function (LUISResponse) {
                    resolve(LUISResponse)
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    } catch (err) {
        throw err;
    }
};