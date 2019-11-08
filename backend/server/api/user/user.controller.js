import User from './user.model';
const multer = require('multer');
const fs = require('fs');
import { saveUser } from '../../../utilityfunctions/utility-functions';
import { sendSlackMessage } from '../../../utilityfunctions/utility-functions';
const moment = require('moment');

module.exports = {
    'getAllUser': (req, res) => {
        User.find({}, (err, users) => {
            if (err) {
                console.log({err});
                return res.status(500).send({err});
            } else {
                console.log({users});
                return res.json({'status': 200, users});
            }
        });
    },
    'newUser': (req, res) => {
        console.log(req.query);
        let isFileSelected = req.body.isFileSelected || req.query.isFileSelected;
        if (isFileSelected) {
            req.body = req.query;
        }
        let newUser;
        let data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            jobTitle: req.body.jobTitle
        };
        if (isFileSelected) {
            let uploadedFileName, dirPath;
            let storage = multer.diskStorage({
            destination: (req, file, cb) => {
                dirPath = './upload';
                if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
                }
                cb(null, dirPath + '/');
            },
            filename: (req, file, cb) => {
                let ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
                let fileName = Date.now() + ext;
                uploadedFileName = fileName;
                cb(null, fileName);
            },
            });
            let upload = multer({
            storage: storage,
            }).single('file');
            upload(req, res, async (err) => {
                if (err) {
                    console.log({err})
                    return res.status(500).send({err});
                }
                data.photo = uploadedFileName;
                saveUser(data)
                .then(userInfo => {
                    let text = `${userInfo.firstName} ${userInfo.lastName} has created a profile on your app at ${moment(new Date()).format('HH:mm a')} on ${moment(new Date()).format('LL')}.`
                    sendSlackMessage(text);
                    return res.json({'status': 200, 'userInfo': userInfo});
                })
                .catch(err => {
                    return res.status(500).send({err});
                })
            });
        } else {
            saveUser(data)
            .then(userInfo => {
                let text = `${userInfo.firstName} ${userInfo.lastName} has created a profile on your app at ${moment(new Date()).format('HH:mm a')} on ${moment(new Date()).format('LL')}.`
                sendSlackMessage(text);
                return res.json({'status': 200, 'userInfo': userInfo});
            })
            .catch(err => {
                return res.status(500).send({err});
            });
        }
    },
    'updateUser': (req, res) => {
        let id = req.params.id;
        console.log('Updated User', id);
        let updatedBy = req.body.updatedBy;
        delete req.body.updatedBy;
        User.updateOne({_id: id}, req.body, (err, userInfo) => {
            if (err) {
                console.log({err});
                return res.status(500).send({err});
            } else {
                console.log({userInfo});
                let text = `${updatedBy} has updated the profile on your app at ${moment(new Date()).format('HH:mm a')} on ${moment(new Date()).format('LL')}.`
                sendSlackMessage(text);
                return res.json({'status': 200, userInfo});
            }
        });
    },
    'userById': (req, res) => {
        User.findById(req.query.userId, (err, user) => {
            if (err) {
                console.log({err});
                return res.status(err.name === 'CastError'? 404: 500).send({err});
            } else {
                console.log({user});
                return res.json({'status': 200, user});
            }
        });
    }
}