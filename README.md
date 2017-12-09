# tbm-api


## Install

Install the node packages via:

`$ npm install`

And then run the grunt task to compile the TypeScript:

`$ npm run grunt`

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

`$ npm start`
