import React, { Component } from "react";
import Meal from "./components/Meal";
import placeholder from "./assets/images/foodplaceholder.png";

class App extends Component {
  getFoodInfo = (foodId) => {
    console.log(`get info from ${foodId}`);
  }

  selectFood = (foodId) => {
    console.log(`select ${foodId}`);
  }

  render() {
    const foodItems = [
      "Comida 1", "Comida 2", "Comida 3",
      "Comida 4", "Comida 5", "Comida 6",
      "Comida 7", "Comida 8", "Comida 9"
    ];

    return (
      <div className="container py-4">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {foodItems.map((foodId, index) => (
            <div className="col" key={index}>
              <Meal
                foodId={foodId}
                getInfo={() => this.getFoodInfo(foodId)}
                selectFood={() => this.selectFood(foodId)}
                img = {placeholder}
                price = {"20,00"}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;