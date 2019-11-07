import User from '../server/api/user/user.model';
const Slack = require('../service/slack');
// instantiate Slack
let SlackApp = new Slack();

const generalFunctions = module.exports = {
    'saveUser': (user) => {
        return new Promise((resolve, reject) => {
            let newUser = new User(user);
                newUser.save((err, userInfo) => {
                    if (err) {
                        console.log({err});
                        reject(err);
                    } else {
                        console.log({userInfo});
                        resolve(userInfo);
                    }
                });
        });
    },
    'sendSlackMessage': (text) => {
        console.log({text, SlackApp}, 'utility Functions');
        //SlackApp.text = text;
        SlackApp.notifyOwner(text);
    }
};