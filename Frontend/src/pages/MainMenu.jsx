import React, { Component } from 'react';
import { motion } from 'framer-motion';
import logo from "../assets/images/logo_mealrush.jpeg";
import vendingMachine from "../assets/images/vending_machine.png";

export default class MainMenu extends Component {
  render() {
    return (
      <>
        <div className="d-flex flex-column tp h-screen w-full">
        <nav className="navbar navbar-expand-lg navbar-black fixed-top" style={{ background: "green"}}>
          <div className="container-fluid">
            <div className="d-flex align-items-center">
              <img src={logo} style={{ width: 60 }} className="img-fluid" />
            </div>

            <div className="position-absolute top-50 start-50 translate-middle text-center">
              <a className="navbar-brand text-white" style={{ fontFamily: "'Century Gothic', sans-serif", fontSize: 40 }}>
                MealRush
              </a>
            </div>

            <button
              className="navbar-toggler ms-auto"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" style={{ fontSize: 20 }} id="navbarNav">
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

        <div className="container" style={{ marginTop: 100 }}>
          <div className="row align-items-center">
            <motion.div
              className="col-12 col-md-6 d-flex justify-content-center mb-4 mb-md-0"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <img src={vendingMachine} className="img-fluid" style={{ maxWidth: 250 }} />
            </motion.div>

            <motion.div
              className="col-12 col-md-6 d-flex justify-content-center align-items-center flex-column text-white text-center"
              style={{background: "green", borderRadius: 20, padding: 30}}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="px-3" style={{ fontFamily: "'Century Gothic', sans-serif", fontSize: 24 }}>
                Bem-vindo ao nosso site informativo! Aqui você encontra informações sobre nós, nossos serviços de preparo de comida e muito mais! Fique por dentro de todo o processo da MealRush!
              </h1>
            </motion.div>
          </div>
        </div>
        <div className="container text-white" style = {{background: "green", borderRadius: 20, padding: 20, fontFamily: "'Century Gothic', sans-serif", marginTop: 150}}>
          <h1 className="px-3" style={{ fontFamily: "'Arial', sans-serif", fontSize: 30, fontWeight: "bold", textDecoration: "underline" }}>Quem somos?</h1>
          <div className="row align-items-center">
            <motion.div
              className="col-12 col-md-6 d-flex justify-content-center mb-4 mb-md-0"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1}}
              viewport={{ amount: 0.3 }}
            >
              <img src={logo} className="img-fluid" style={{ maxWidth: 250 }} />
            </motion.div>

            <motion.div
              className="col-12 col-md-6 d-flex justify-content-center align-items-center flex-column text-center"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ amount: 0.3 }}
            >
              <h1 className="px-3" style={{ fontFamily: "'Century Gothic', sans-serif", fontSize: 24 }}>
                Fundada em 2025, a MealRush tem como objetivo fornecer uma alimentação saudável para as pessoas, e para isso utilizamos máquinas de venda extremamente ágeis que preparam rapidamente as refeições, temos diversas opções nutritivas para todos os tipos de gostos. 
              </h1>
            </motion.div>
          </div>
        </div>
        </div>
      </>
    );
  }
}
