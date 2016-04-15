import * as jwt from 'jsonwebtoken';
import * as hapiAuthJwt2 from 'hapi-auth-jwt2';
import { Server } from 'hapi';

import database from '../database';
import config from '../configurations';

export default function(server: Server){
    server.register(hapiAuthJwt2, err => {
        if (err){
            console.error(err);
            throw err;
        }
        
        server.auth.strategy('jwt', 'jwt', false, {
            key: config.auth.jwtSecret,
            validateFunc: (decoded, request, callback) => {
                database.instance['app_user'].findDoc({ email: decoded.email }, function(err, doc){
                    if (err || !doc || !doc.length)
                        return callback(err, false);

                    return callback(null, true, { email: doc[0].email });
                });
            }, verifyOptions: {
                issuer: config.auth.jwtOptions.issuer,
                audience: config.auth.jwtOptions.audience
            }
        });
        
        server.auth.default('jwt');

        server.ext('onPreResponse', function(req, rep){
            // resend a token on every response to update token expiration
            if (!req.auth.isAuthenticated)
                return rep.continue();

            var payload = {
                email: req.auth.credentials.email
            };

            var token = jwt.sign(payload, config.auth.jwtSecret, {
                expiresIn: '3h',
                audience: 'audience',
                issuer: 'issuer'
            });

            Object.assign(req.response.source, { token });

            return rep.continue();
        });
    });
}