import * as bcrypt from 'bcryptjs';
import * as moment from 'moment';
import * as massive from 'massive';
import AppUser from '../models/AppUser';

const connectionString = "postgres://web:aaAA1111@localhost:5432/hapi-postgresql-play";

const instance = massive.connectSync({ connectionString });

const seedInitialData = function(){
    if (!instance['app_user'] || !instance['app_user'].findOneSync({})){
        var defaultUser = new AppUser("test@ic.le");
        defaultUser.registrationDate = moment.utc().toISOString();

        bcrypt.hash('password', 10, function(err, hash){
            defaultUser.passwordHash = hash;
            instance.saveDoc('app_user', defaultUser, function(err, res){
                console.log(`User ${res.id} - '${res.email}' is seeded`);
            });
        });
    }
};

export default {
    instance,
    seedInitialData
}