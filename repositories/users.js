const fs = require('fs');
const crypto = require('crypto');

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
        attrs.id = this.randomId();
        const records = await this.getAll();
        records.push(attrs);
        await this.writeAll(records);
    }

    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }
    
    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);

        if (!record) {
            throw new Error(`Record with id ${id} not found!`);
        }

        Object.assign(record, attrs);
        await this.writeAll(records);
        
    }

    async getOneBy(filters) {
        const records = await this.getAll();
        for (let record of records) {
            let found = true;
            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }
            if (found) {
                return record;
            }
        }
    }
}

const test = async () => {
    const repo = new UsersRepository('users.json');
    await repo.update('dzxczxc', { password: '123456789' });
    console.log("done testing!");
};

test();
// console.log("MAIN FUNC AFTER TEST");


// const myProm = new Promise((resolve, reject) => {
//     setTimeout(() => {resolve('RESOLVE PROMISE')}, 3000);
// });
// const myPromVal = await myProm;
