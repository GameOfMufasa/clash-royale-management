const request = require("request");
const util = require('util');
const Promise = require("promise");
const moment = require("moment");
const fs = require('fs');
const config = require("config");

const baseUrl = "https://api.clashroyale.com/v1/clans/%s/";

const apiInfo = {
    clanInfo: baseUrl + "",
    clanMembers: baseUrl + "members",
    clanWarLog: baseUrl + "warlog",
    authKey: "Bearer " + config.get("authKey")
};

const makeGetRequest = (url) => {
    console.log(url);
    return new Promise((resolve, reject) => {
        request({
            headers: {
                "Accept": "application/json",
                "authorization": apiInfo.authKey
            },
            uri: url,
            method: 'GET'
        }, function (err, res, body) {
            let json = JSON.parse(res.body);
            if (json.reason) {
                reject(json);
            } else {
                resolve(json);
            }
        });
    });
};

const defaults = {"tag": null,"name": null,"role": null,"trophies": null,"battlesPlayed": null,"lastPlayed": null,"lastPlayedString": null,"firstSeen": null};

const getClanMembers = clanID => makeGetRequest(util.format(apiInfo.clanMembers, clanID));

const getWarLog = (clanID, limit) => makeGetRequest(util.format(apiInfo.clanWarLog + "?limit=" + limit, clanID));

module.exports = (async () => {
    try {
        const _ = require("underscore");
        const clanIDFull = config.get("clan").tag.replace("#", "%23");
        const full_data_file = config.get("server").files.full_data;
        const data_file = config.get("server").files.datatable_json;
        const date_format = config.get("server").date_format;
        const hasOlderData = fs.existsSync(full_data_file);
        const nowTimeForFirstSeen = moment();

        let oldRecordsUsers = {};

        if (hasOlderData) {
            let oldRecordsUsersAsync = new Promise((resolve, reject) => {
                fs.readFile(full_data_file, 'utf8', (err, data) => {
                    resolve(JSON.parse(data));
                });
            });

            oldRecordsUsers = await oldRecordsUsersAsync;
            oldRecordsUsers = _.mapObject(oldRecordsUsers, val => {
                val = Object.assign(_.extend({}, defaults), val);
                val.firstSeen = val.firstSeen || nowTimeForFirstSeen.format(date_format);
                return val;
            });
        }

        let members = await getClanMembers(clanIDFull);
        let currentUsers = {};

        for (let user of members.items) {
            if (!oldRecordsUsers[user.tag]) {
                currentUsers[user.tag] = _.extend({}, defaults);
                currentUsers[user.tag].firstSeen = nowTimeForFirstSeen.format(date_format);
            } else {
                currentUsers[user.tag] = oldRecordsUsers[user.tag];
            }
            currentUsers[user.tag].tag = user.tag;
            currentUsers[user.tag].name = user.name;
            currentUsers[user.tag].role = user.role;
            currentUsers[user.tag].trophies = user.trophies;
        }

        let clanWars = await getWarLog(clanIDFull, config.get("clan").past_war_logs_limit);

        for (let warLog of clanWars.items) {
            let warDate = moment(warLog.createdDate, "YYYYMMDDTHH:mm:ss.SSSZ");
            for (let participant of warLog.participants) {
                if (currentUsers[participant.tag]) {
                    if (warDate.valueOf() > (currentUsers[participant.tag].lastPlayed || 0)) {
                        currentUsers[participant.tag].battlesPlayed = (currentUsers[participant.tag].battlesPlayed || 0) + 1;
                        currentUsers[participant.tag].lastPlayed = warDate.valueOf();
                        currentUsers[participant.tag].lastPlayedString = warDate.format(date_format);
                    }
                }
            }
        }

        fs.writeFile(full_data_file, JSON.stringify(currentUsers, null, 2), 'utf8', () => {
        });

        let array = Object.values(currentUsers);
        fs.writeFile(data_file, JSON.stringify({"data": array}, "", 2), 'utf8', () => {
        });
    } catch (ex) {
        return ex;
    }
});