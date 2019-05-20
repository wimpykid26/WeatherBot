
import morgan from 'morgan';
import tracer from 'tracer';
let moment = require('moment');

export const log = (() => {
    const logger = tracer.colorConsole();
    logger.requestLogger = morgan('dev');
    return logger;
})();

export const normalizePort = (val) => {
    const port = parseInt(val, 10);
    if (Number.isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
};

export const delay = time => new Promise((resolve) => {
    setTimeout(() => { resolve(); }, time);
});

export const parseOpenWeatherResponse = (openWeatherResponse, place, unit) => {
    let attachment = {};
    if (openWeatherResponse.name != null) {
        attachment.city = openWeatherResponse.name;
    } else {
        attachment.city = place;
    }
    attachment.unit = (unit = 'celsius' || 'Celsius') ? "Celsius" : "Fahrenheit";
    attachment.condition = openWeatherResponse.weather[0].main;
    attachment.conditionDescription = openWeatherResponse.weather[0].description;
    attachment.imageUrl = `http://openweathermap.org/img/w/${openWeatherResponse.weather[0].icon}.png`;
    attachment.temperature = openWeatherResponse.main.temp;
    attachment.humidity = openWeatherResponse.main.humidity;
    attachment.pressure = openWeatherResponse.main.pressure;
    attachment.tempMin = openWeatherResponse.main.temp_min;
    attachment.tempMax = openWeatherResponse.main.temp_max;
    attachment.dateTime = openWeatherResponse.dt;
    attachment.windSpeed = openWeatherResponse.wind;
    return attachment;
}

export const constructSlackResponse = (intent, attachment, text, channelId) => {
    const response = {}
    response.response_type = 'in_channel';
    response.channel = channelId;
    if (text != null) {
        response.text = text;
    }

    let attachmentObj = {};
    attachmentObj.fallback = "Looks like you have a query about the weather";
    attachmentObj.color = "#2eb886";
    attachmentObj.pretext = "Here is the result of your query";
    if (intent = "Weather.CheckWeatherValue") {
        let dateString = moment.unix(attachment.dateTime).format("MM/DD/YYYY");
        attachmentObj.title = `Weather for ${attachment.city} on ${dateString} :`;
    }
    attachmentObj.fields = [
        {
            "title": "Unit",
            "value": attachment.unit,
            "short": true
        },
        {
            "title": "Condition",
            "value": attachment.conditionDescription,
            "short": false
        },
        {
            "title": "Description",
            "value": attachment.condition,
            "short": false
        },
        {
            "title": "Temperature",
            "value": attachment.temperature,
            "short": true
        },
        {
            "title": "Maximum Temperature",
            "value": attachment.tempMax,
            "short": true
        },
        {
            "title": "Minimum Temperature",
            "value": attachment.tempMin,
            "short": true
        },
        {
            "title": "Pressure",
            "value": attachment.pressure,
            "short": true
        },
        {
            "title": "Humidity",
            "value": attachment.humidity,
            "short": true
        },
        {
            "title": "Wind Speed",
            "value": attachment.windSpeed,
            "short": true
        }
    ]
    attachmentObj.footer = "Powered by OpenWeather";
    attachmentObj.footer_icon = "https://platform.slack-edge.com/img/default_application_icon.png";
    attachmentObj.thumb_url = attachment.imageUrl;
    response.attachments = [attachmentObj];
    return response;
}