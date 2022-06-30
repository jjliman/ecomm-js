const layout = require('../layout');
const { getError } = require('../../helpers');

module.exports = ({ errors }) => {
    return layout({
        content: `
            <div>
                <form method="POST">
                    <input name="title" placeholder="Title">
                    <input name="price" placeholder="Price">
                    <input type="file" name="image">
                    <button>Submit</button>
                </form>
            </div>
        `
    });
}