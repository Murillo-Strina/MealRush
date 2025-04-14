const db = require("../Database/connection.js");

class FoodService {

    async FindAll() {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM foods", (err, foods) => {
                if (err) {
                    reject(err);  // Rejeita a promise se houver erro
                } else {
                    resolve(foods);  // Resolve a promise com os alimentos
                }
            });
        });
    }
}

module.exports = new FoodService();
