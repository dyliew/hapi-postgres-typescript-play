import * as Hapi from "hapi";

import auth from './auth';
import routes from './routes';
import database from './database';

const server = new Hapi.Server();
server.connection({ port: 8080 });

auth(server);
routes(server);

database.seedInitialData();

server.start(err => {
    if (err)
        throw err;
        
    console.log(`Server running at: ${server.info.uri}`);
});