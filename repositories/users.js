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
        const contents = await fs.promises.readFile(this.filename, { encoding: 'utf-8' });
        console.log(contents);
    }
}

const test = () => {
    const repo = new UsersRepository('users.json');;
}
