## Information:
Help you managed your clan with members information about your wars.

## Development
Make sure you have installed [Node.js](https://nodejs.org/en/download/) on your development machine.

##### Generating Access Token:
By registering to the Clash Royale Developer site: https://developer.clashroyale.com/#/register
* Register in the link above.
* Confirm your account and login.
* Create new Auth key: https://developer.clashroyale.com/#/new-key
    * You need to find your IP address ([Whats My IP](http://www.whatsmyip.org/)) and use it in order to create and use your key.
* Create your new key.


##### Install
```bash 
git clone https://github.com/GameOfMufasa/clash-royale-management.git
cd clash-royale-managment
npm install
```

##### Generate config file
```bash 
node config.js \
    conf_name=<conf_name> \
    clan_tag=<clan_tag> \ 
    authKey=<auth_key> \
    port=<port> \
    hostname=<hostname> \
    file_full=<file_full> \
    file_table=<file_table> \
    date_format="<date_format>"
```
* `conf_name`, `clan_tag` and `authkey` are <u><b>required</b></u>
all other variables can be remove, for example:
    ```bash 
    node config.js \
        conf_name=love \
        clan_tag=#ABC1234 \ 
        authKey=kalst98013kldasf9h3asdj29asdl....aksljf9023jrajsd
    ```
* You can also generate default config to shorten your call with `conf_name` set as `default`
    ```bash 
    node config.js \
        conf_name=default \
        clan_tag=#ABC1234 \ 
        authKey=kalst98013kldasf9h3asdj29asdl....aksljf9023jrajsd
    ```


##### Run
* To run the server with the `default` config file:
    ```bash 
    npm run start
    ```
* Or using our custom config `love`:
    ```bash 
    npm run start-love
    ```
    
* Go to ```http://localhost:8080``` and watch the information that we have collected.
