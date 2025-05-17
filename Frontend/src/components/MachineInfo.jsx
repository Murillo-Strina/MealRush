import React, { Component } from 'react'

export default class MachineInfo extends Component { 
  render() {
    const cardType = this.props.type;

    let content = "Tipo de cartão não especificado";
    
    if (cardType === "company") {
      content = (
        <>
          <p>Empresa: {this.props.company}</p>
        </>
      );
    } else if (cardType === "id") {
      content = (
        <>
          <p>ID da máquina: {this.props.id}</p>
        </>
      );
    }

    return (
      <div className="text-light p-3 bg-dark border border-dark rounded text-center d-flex align-items-center justify-content-center">
        {content}
      </div>
    );
  }
}