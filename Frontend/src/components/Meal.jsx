import React, { Component } from "react";

export default class Meal extends Component {
    render() {
        return (
            <div className="border-none bg-warning text-center d-flex align-items-center justify-content-center position-relative"
                style={{
                    height: "300px",
                    width: "400px"
                }}>
                <button className="btn btn-dark position-absolute rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                        top: "10px",
                        right: "10px",
                        width: "30px",
                        height: "30px",
                        padding: 0
                    }}
                    onClick={this.props.getInfo}>
                    i
                </button>
                <div className="text-light bg-dark position-absolute top-0 start-0 m-2 p-2 d-flex align-items-center">
                    <span className="fw-normal">{this.props.foodId}</span>
                </div>
                <img
                    src={this.props.img}
                    alt={this.props.foodId}
                    className="img-fluid"
                    style={{
                        maxHeight: '200px',
                        objectFit: 'cover'
                    }}
                />
                <div className="fs-4 rounded-0 bg-success position-absolute d-flex align-items-center justify-content-center text-white"
                    style={{
                        bottom: "0px",
                        height: "50px",
                        width: "400px",
                        cursor: 'default'
                    }}>
                    R$ {this.props.price}
                </div>
            </div>
        );
    }
}