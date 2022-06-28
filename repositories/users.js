const fs = require('fs');

class UsersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository requires a file name!');
        }
        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async getAll() {
        // Open the file this.filename
        return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf-8' }));
        // const contents = await fs.promises.readFile(this.filename, { encoding: 'utf-8' });
        // const data = JSON.parse(contents);
        // return data;
    }

    async create(attrs) {
        const records = await this.getAll();
        records.push(attrs);
        await fs.promises.writeFile(this.filename, JSON.stringify(records));
    }
}

const test = async () => {
    const repo = new UsersRepository('users.json');
    await repo.create({ email: 'test@test.com', password: 'passwordisntagoodpassword' });
    const users = await repo.getAll();
    console.log(users);
    console.log("done testing!");
};

test();
// console.log("MAIN FUNC AFTER TEST");


// const myProm = new Promise((resolve, reject) => {
//     setTimeout(() => {resolve('RESOLVE PROMISE')}, 3000);
// });
// const myPromVal = await myProm;
