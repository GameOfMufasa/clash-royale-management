## Information:
Help you managed your clan with members information about your wars.

## How to use
1. Register to the Clash Royale Developer site: https://developer.clashroyale.com/#/register
    1. Register in the link above.
    2. Confirm your account and login.
    3. Create new Auth key: https://developer.clashroyale.com/#/new-key
        * You need to find your IP address ([Whats My IP](http://www.whatsmyip.org/)) and use it in order to create and use your key.
    4. Create your new key.
2. Use this project
    1. Clone this project and install dependencies:
        ```bash 
        git clone https://github.com/GameOfMufasa/clash-royale-management.git
        cd clash-royale-managment
        npm install
        ```
    2. Put your key in the config file and the clan tag you want to manage:
        1. Go to ```clash-royale-managment/config```
        2. Open ```default.json``` for editing
        3. Under the ```clan``` property put the tag of your clan (should look something like this: ```#AB123CD```)
        4. Put the authKey you created in step 1
        5. change port or other config you need
    3. Run this project:
        ```bash 
        npm run start
        ```
    4. Go to ```http://localhost:8080```
