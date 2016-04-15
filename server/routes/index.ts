import { Server } from "hapi";

import config from '../configurations'

import authRoutes from './auth'; 

export default function(server: Server){
    server.route({
        method: 'GET',
        path: '/',
        config: { auth: false },
        handler: (request, reply) => reply({ message: "me Hapi true!" })
    });

    server.route({
        method: 'GET',
        path: '/refresh',
        handler: (request, reply) => {
            reply({ 
                message: "refreshed~!",
                email: request.auth.credentials.email
            })
        }
    });
    
    authRoutes(server);
}