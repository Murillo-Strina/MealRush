const db = require("../Database/connection.js");

class FoodService {

    async FindAll() {
        try {
            const [foods] = await db.promise().query("SELECT * FROM foods");
            return foods;
        } catch (err) {
            throw err;
        }
    }

    async FindById(id) {
        try {
            const food = await db.promise().query("SELECT * FROM foods WHERE id = ?", [id]);
            return food[0];
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new FoodService();
