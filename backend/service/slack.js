var request = require('request');

class Slack {
    constructor() {
        this.url = "https://slack.com/api/chat.postMessage";
        this.auth_token = 'token';
        this.headers = {
            "Authorization": "Bearer " + this.auth_token,
            "Content-Type": "application/json"
        }
        this.body = {
            channel: 'id', // Slack user or channel, where you want to send the message
            text: ""
        }
    }

    set text(text) {
        this._text = text;
    }
    get text() {
        return this._text;
    }

    notifyOwner(text) {
        this.body.text = text;
        request.post({
            "url": this.url,
            "headers": this.headers,
            "body": JSON.stringify(this.body)
        }, (err, response, body) => {
            if (err) {
                reject(err);
            }
            console.log("response: ", JSON.stringify(response));
            console.log("body: ", body);
        });
    }
}

module.exports = Slack;