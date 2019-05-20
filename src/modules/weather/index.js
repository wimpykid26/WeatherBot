let rp = require('request-promise');
import { parseOpenWeatherResponse, constructSlackResponse } from '../../utils';
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

export const parseLUISResponse = (LUISResponse) => {
    intent = LUISResponse.topScoringIntent.intent;
    entities = [];
    LUISResponse.entities.map(function parseEntity(entity) {
        if (entity.type.indexOf('geographyV2') > -1) {
            entities.push({ type: 'City', value: entity.entity });
        } else if (entity.type.indexOf('datetimeV2') > -1) {
            entities.push({ type: 'Date', value: entity.entity });
        };
    });
    return { intent, entities }
};

export const weatherController = async (LUISResponse, channelId) => {
    let { intent, entities } = parseLUISResponse(LUISResponse);
    if (intent == 'Weather.CheckWeatherValue' || 'Weather.QueryWeather') {
        //Check for places, if not use current LatLng
        let placeIndex = entities.findIndex(x => x.type == 'City');
        if (placeIndex > -1) {
            //Call api for city
            let city = entities[placeIndex].value;
            try {
                var options = {
                    uri: 'api.openweathermap.org/data/2.5/weather',
                    qs:
                    {
                        'APPID': 'e101c80f28e7c194f52d9415e4be26f1',
                        q: city
                    },
                };
                return new Promise((resolve, reject) => {
                    rp(options)
                        .then(function (openWeatherResponse) {
                            //Construct Slack Response
                            attachment = parseOpenWeatherResponse(openWeatherResponse, city, 'celsius');
                            SLACKResponse = constructSlackResponse(intent, attachment, channelId);
                            resolve(SLACKResponse)
                        })
                        .catch(function (err) {
                            reject(err);
                        });
                });
            } catch (err) {
                throw err;
            }
        }
        else {
            //Call api with LatLng
        }
    }
}