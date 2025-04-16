import React, { Component } from 'react';
import logo from "../assets/images/logo_mealrush.jpeg";
export default class MainMenu extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-black" style={{ background: "green" }}>
        <div className="container-fluid position-relative">
            <div>
                <img src={logo} style={{width:85, marginRight:800}}/>
            </div>
          <div className="position-absolute start-50 translate-middle-x">
            <a className="navbar-brand text-white" style={{fontFamily:"'Century Gothic', sans-serif", fontSize: 50}}>MealRush</a>
          </div>
          
          <button 
            className="navbar-toggler ms-auto"
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse"style={{fontSize:20}} id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active text-white" href="#">Sobre nós</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#">Alimentos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#">Parcerias</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#">Simulação</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}