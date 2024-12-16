## Setup

- Download and install node.js - https://nodejs.org/en
- Download and install google - https://www.google.com/intl/en_uk/chrome/
- Pull the project from moodle or from github page - https://github.com/edipekaric/frontend
- The git repository already has the test
- Test setup @ line 8 of code await driver.get("http://localhost:5173"); , change last 4 digits to whatever your local host is
- Afte that You need to download dependencies in the project
- `npm install selenium-webdriver`
- `npm install chromedriver`
- `npm install`
- Run the backend from this page - https://gist.github.com/DaGeRe/4c9a22b8e5593d88bea350d480597921
- After this, from root folder (edi) navigate into cw `cd cw`
- Run the project `npm run dev`
- Verify that the new frontend is running
- Open command prompt, and navigate into the tests folder `cd cw/src/tests`
- Than run the test with the following command `node test_tea_shop.js`
