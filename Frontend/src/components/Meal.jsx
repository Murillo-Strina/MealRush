import React, { Component } from "react";

export default class Meal extends Component {
    render() {
        return (
            <div className="border border-dark bg-warning text-center d-flex align-items-center justify-content-center position-relative"
                style={{
                    height: this.props.style?.height || "250px",
                    width: this.props.style?.width || "100%",
                    ...this.props.style
                }}>
                <button className="btn btn-dark position-absolute rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                        top: "8px",
                        right: "8px",
                        width: "25px",
                        height: "25px",
                        padding: 0,
                        fontSize: "0.8rem"
                    }}
                    onClick={this.props.getInfo}>
                    i
                </button>
                
                <div className="text-light bg-dark position-absolute top-0 start-0 m-1 p-1 d-flex align-items-center rounded">
                    <span className="fw-normal small">{this.props.foodId}</span>
                </div>
                
                <img 
                    src={this.props.img} 
                    alt={this.props.foodId} 
                    className="img-fluid h-50"
                />
                
                <div className="rounded-0 bg-success position-absolute d-flex align-items-center justify-content-center text-white fw-bold small"
                    style={{
                        bottom: "0px",
                        height: "30px",
                        width: "100%",
                        fontSize: "0.9rem"
                    }}>
                    R$ {this.props.price}
                </div>
            </div>
        );
    }
}