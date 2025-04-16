import React, { Component } from "react";
import Meal from "./components/Meal";
import placeholder from "./assets/images/foodplaceholder.png";
import Numpad from "./components/Numpad";

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
      <div className="container-fluid d-flex flex-wrap py-3">
        <div className="flex-grow-1 me-3" style={{ maxWidth: 'calc(70% - 1rem)' }}>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-2">
            {foodItems.map((foodId, index) => (
              <div className="col" key={index}>
                <Meal
                  foodId={foodId}
                  getInfo={() => this.getFoodInfo(foodId)}
                  selectFood={() => this.selectFood(foodId)}
                  img={placeholder}
                  price={"20,00"}
                  style={{ 
                    height: '180px',
                    width: '100%' 
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0" style={{ width: '300px' }}>
          <Numpad buttonSize="70px" fontSize="1.5rem" />
        </div>
      </div>
    );
  }
}

export default App;