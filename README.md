# tbm-api


## Install

Install the node packages via:

`$ npm install`

## Configuration

Create .env variable similar to .env.example

Example database config:

`
    DB_TYPE="mysql"
    DB_HOST="localhost"
    DB_PORT=3306
    DB_USER="root"
    DB_PASS=""
    DB_DATABASE="example"
    DB_SYNCHRONIZE=false
    DB_LOGGING=false
`

## Starting

To start the server run:

### Dev

    `$ npm start`

### Production

    `$ npm start prod`


## Testing

To test api endpoints:

### Dev

    `$ npm run test`

### Production

    `$ npm run testprod`


