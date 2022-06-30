const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository')

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
    async create(attrs) {
        // attrs === { email: '', password: '' }
        attrs.id = this.randomId();
        
        const salt = crypto.randomBytes(8).toString('hex');
        const hashedBuf = await scrypt(attrs.password, salt, 64);

        const records = await this.getAll();
        const record = {
            ...attrs,
            password: `${hashedBuf.toString('hex')}.${salt}`
        };
        records.push(record);

        await this.writeAll(records);
        return record;
    }

    async comparePassword(saved, supplied) {
        // Saved -> password saved in our db 'hashed.salt'
        // Supplied -> password given to us by a user
        const [hashed, salt] = saved.split('.');
        const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

        return hashed === hashedSuppliedBuf.toString('hex');

    }
}


module.exports = new UsersRepository('users.json');  

// const test = async () => {
//     const repo = new UsersRepository('users.json');
//     const user = await repo.getOneBy({ password: '123456789', id: '4e2f6d98', swag: "TRUE" });
//     console.log(user);
//     console.log("done testing!");
// };

// test();
// console.log("MAIN FUNC AFTER TEST");


// const myProm = new Promise((resolve, reject) => {
//     setTimeout(() => {resolve('RESOLVE PROMISE')}, 3000);
// });
// const myPromVal = await myProm;
