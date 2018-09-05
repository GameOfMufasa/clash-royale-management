(async () => {
    const fs = require("fs");

    const args = process.argv
        .slice(2)
        .map(arg => arg.split('='))
        .reduce((args, [value, key]) => {
            args[value.toLowerCase()] = key;
            return args;
        }, {});

    if ("--help" in args) {
        console.log("");
        console.log("Follow these configurations to set up your environment:");
        console.log("\tconf_name \t- Config file name, you can use it like this: \"npm run start-<conf_name>\". (required)");
        console.log("\tclan_tag \t- Should be the clan tag you want to get information about. (required)");
        console.log("\tauthKey \t- the key that you generated from clash royale developers site. (required)");
        console.log("\tlimit \t\t- Limit the number of past wars to use.");
        console.log("\tport\t\t- The port you want this server to run on. (default is 8080)");
        console.log("\thostname\t- Server url (default is localhost > 127.0.0.1).");
        console.log("\tdata_file\t- Set different name for the file that stores all the data.");
        console.log("\tdate_format\t- Default is \"YYYY/MM/DD HH:mm\" (Best for sorting)");
        console.log("");
        console.log("Setting configurations like this: \n\tnode config.js conf_name=\"home\" clan_tag=\"#ABC1234\" ... ");
        return;
    }

    function myError(error) {
        console.error(error);
        console.log("Need help?");
        console.log("\tnode start --help");
    }

    if (!args["conf_name"]) {
        return myError("Cannot create config without a name!");
    }

    if (args["conf_name"].indexOf(" ") !== -1) {
        return myError("Config name cannot contain spaces!");
    }

    if (!args["clan_tag"]) {
        return myError("Cannot create config without a Clan tag!");
    }

    if (!args["authkey"]) {
        return myError("Cannot create config without a auth key!");
    }

    let defaultConfig = {
        "clan": {
            "tag": "",
            "past_war_logs_limit": 20
        },
        "authKey": "",
        "server": {
            "port": 8080,
            "hostname": "127.0.0.1",
            "files": {
                "data_file": "data/data_file.json",
            },
            "date_format": "YYYY/MM/DD HH:mm"
        }
    };

    if (args["clan_tag"] && args["clan_tag"].startsWith("#")) {
        defaultConfig.clan.tag = args["clan_tag"];
    }

    if (args["limit"]) {
        defaultConfig.clan.past_war_logs_limit = parseInt(args["limit"]);
    }

    if (args["authkey"]) {
        defaultConfig.authKey = args["authkey"];
    }

    if (args["port"]) {
        defaultConfig.server.port = parseInt(args["port"]);
    }

    if (args["hostname"]) {
        defaultConfig.server.hostname = args["hostname"];
    }

    if (args["data_file"]) {
        defaultConfig.server.files.data_file = "data/" + args["data_file"];
    }

    if (args["date_format"]) {
        defaultConfig.server.date_format = args["date_format"]
    }


    fs.writeFile("config/" + args["conf_name"] + ".json", JSON.stringify(defaultConfig, "", 2), 'utf8', () => {});

    let packageJson = await new Promise((resolve, reject) => fs.readFile("package.json", 'utf8', (err, data) => resolve(JSON.parse(data))));

    packageJson.scripts["start-" + args["conf_name"]] = "node server.js NODE_ENV=\"" + args["conf_name"] + "\"";

    fs.writeFile("package.json", JSON.stringify(packageJson, "", 2), 'utf8', () => {});

    console.log(packageJson);
    console.log("Config file has been created");
    console.log("You can now run the server using");
    console.log("\tnpm run start-"+args["conf_name"]);
})();