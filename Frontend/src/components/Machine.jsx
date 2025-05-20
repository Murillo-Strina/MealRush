import React, { Component } from "react";
import Meal from "./Meal";
import placeholder from "../assets/images/foodplaceholder.png";
import Numpad from "./Numpad";
import MachineInfo from "./MachineInfo";

class Machine extends Component {
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
      <div className="container-fluid py-3">
        <div className="row mb-4">
          <div className="col-md-6 mb-3 mb-md-0">
            <MachineInfo
            type={"company"}
            company={"Instituto Mauá de Tecnologia"}
            />
          </div>
          <div className="col-md-6">
            <MachineInfo
            type={"id"}
            id={"22007300"}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-9">
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
          <div className="col-lg-3 mt-3 mt-lg-0">
            <div className="sticky-top" style={{ top: '20px' }}>
              <Numpad buttonSize="70px" fontSize="1.5rem" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Machine;