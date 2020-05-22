# Henrietta
### Amazing Wonderflow Front-End Applicaiton 
## Setup
1. Clone and install dependencies:
```bash
git clone https://github.com/wonderfloyd/Henrietta.git
npm install
```

2. Add a file called `.env` at the root of the project, and add the following to it:
```
REACT_APP_PORT=3000
REACT_APP_API_URL=http://localhost:8000

# Okta
REACT_APP_OKTA_URL=https://dev-567911.okta.com
REACT_APP_OKTA_CLIENT_ID=0oawp4munWGESA3wo356

```

## Run the app
1. Have Ferdininio running as usual at port 8000.
2. run `npm start`.

## Running tests
1. Have both Ferdininio and Henrietta running.
2. Run a Webdriver instance at port 4444 (default).
3. Run `npm run protractor`.
 

