import * as Boom from 'boom';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { Server } from 'hapi';

import config from '../configurations';
import database from '../database';

export default function(server: Server){
    server.route({
        method: 'POST',
        path: '/auth/login',
        config: { auth: false },
        handler: (req, rep) => {
            database.instance['app_user'].findDoc({ email: req.payload.email }, function(err, user){
                if (err)
                    return rep(Boom.badImplementation(err));

                if (!user)
                    return rep(Boom.notFound("Invalid username or password"));

                bcrypt.compare(req.payload.password, user[0].passwordHash, function(err, res){
                    if (err)
                        return rep(Boom.badImplementation(err.message, err));

                    if (!res)
                        return rep(Boom.notFound("Invalid username or password"));

                    var payload = { email: req.payload.email };

                    var token = jwt.sign(payload, config.auth.jwtSecret, config.auth.jwtOptions);

                    return rep({
                        token,
                        message: "Successful login"
                    });
                })
            });
        }
    });
};