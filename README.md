# Whatsapp Gateway

Whatsapp API Gateway which can be used to send messages to a person or group, can also receive and save messages and their media for future use.

## Installation

This application is made using TypeScript so it needs to be compiled into JavaScript before it can be used, here are the steps:

1. Clone this repository using command `git clone https://github.com/vermaysha/whatsapp-gateway.git`
2. Install required package `yarn`
3. Create an .env file whose contents match the example in the .env.example file
4. Make sure to do the migration to ensure that the connection is correct and the necessary tables have been created with the following command `node ace migration:run`
5. Run the seeder database to fill it with the default data with the command `node ace db:seed`
6. Run the following command to compile `yarn build`
7. If you want to run the development server on a local network, you can run the following command `yarn dev`

## API Documentation

To display the Documentation API, make sure you have followed the steps above, then run the following command:

```sh
yarn docs
```

## Deployment

To run the application on the production server, make sure you have compiled this application according to the guide above, then use the following command to run

```sh
cd build
yarn install --production
yarn start
```

**Dont forget to setup your ENV based on .env file** <br>
**Using .env file in production is not recommended, USE REAL ENV !!**

It is recommended to use a process manager when managing a Node.js application on a basic server.

A process manager ensures to restart the application if it crashes during runtime. In addition, some process managers like PM2 can also perform graceful restarts when re-deploying the application.

Following is an example ecosystem file for PM2.

```js
module.exports = {
  apps: [
    {
      name: 'web-app',
      script: './build/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}
```

## LICENSE

[![Creative Commons License](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-sa/4.0/)  
This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/).
