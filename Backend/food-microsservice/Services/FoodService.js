    import db from "../Database/connection.js";

    class FoodService {

        async FindAll() {
            try {
                const [foods] = await db.promise().query("SELECT * FROM foods");
                return foods;
            } catch (err) {
                throw err;
            }
        }

        async FindByName(name) {
            try {
                const [rows] = await db.promise().query("SELECT * FROM foods WHERE name = ?", [name]);
                return rows[0];
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

        async Delete(id) {
            try {
                await db.promise().query("DELETE FROM foods WHERE id = ?", [id]);
            } catch (err) {
                throw err;
            }
        }

        async Create(name, calories, carbs, proteins, fats, weight, imageUrl, sellprice, buyprice ) {
            try {
                return await db.promise().query("INSERT INTO foods(name, calories, carbs, proteins, fats, weight, imageUrl, sellprice, buyprice) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [name, calories, carbs, proteins, fats, weight, imageUrl, sellprice, buyprice]);
            } catch (err) {
                throw err;
            }
        }

        async Update(id, name, calories, carbs, proteins, fats, weight, imageUrl, sellprice, buyprice) {
            try {
                return await db.promise().query("UPDATE foods SET name = ?, calories = ?, carbs = ?, proteins = ?, fats = ?, weight = ?, imageUrl = ?, sellprice = ?, buyprice = ? where id = ?",
                    [name, calories, carbs, proteins, fats, weight, imageUrl, sellprice, buyprice, id]);
            } catch (err) {
                throw err;
            }
        }

    }

    export default new FoodService();