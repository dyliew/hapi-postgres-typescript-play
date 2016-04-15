export default class AppUser {
    email: string;
    registrationDate: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    
    constructor(email: string){
        this.email = email;
    }
}