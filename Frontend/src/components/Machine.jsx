import axios from 'axios';
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Meal from "./Meal.jsx";
import placeholder from "../assets/images/foodplaceholder.png";
import Numpad from "./Numpad";
import { use } from "react";

const Machine = () => {
    const [foodItemsList, setFoodItemsList] = useState([]);

    const colors = {
        darkPrimary: '#1A202C', accent: '#00C9A7', cardBackgroundDark: '#2D3748',
        textLight: '#F7FAFC', textSubtleDarkBg: '#A0AEC0', mediumNeutral: '#E2E8F0',
        danger: '#E53E3E',
    };

    const [numpadValue, setNumpadValue] = useState("");

    const getFoodInfo = (foodId, foodName) => {
        const foodItem = foodItemsData.find(f => f.id === foodId);
        alert(`Detalhes de ${foodName}:\nID: ${foodId}\nPreço: R$ ${foodItem?.price}\nEstoque: ${foodItem?.stock}`);
    };

    const selectFoodOnNumpad = (foodId) => {
        setNumpadValue(foodId);
    };

    const handleNumpadConfirm = (value) => {
        const selectedItem = foodItemsData.find(item => item.id.toUpperCase() === value.toUpperCase());
        if (selectedItem) {
            if (selectedItem.stock > 0) {
                alert(`Confirmado: ${selectedItem.name} (ID: ${value}). Preparando seu pedido!`);
            } else {
                alert(`Desculpe, ${selectedItem.name} está esgotado.`);
            }
        } else {
            alert(`Código de item "${value}" inválido.`);
        }
        setNumpadValue("");
    };

    const foodItemsData = [
        { id: "A1", name: "Wrap Vegano Premium", price: "18,50", image: placeholder, stock: 5 },
        { id: "A2", name: "Salada Caesar com Frango", price: "20,00", image: placeholder, stock: 3 },
        { id: "A3", name: "Suco Verde Detoxificante", price: "12,00", image: placeholder, stock: 8 },
        { id: "B1", name: "Sanduíche Natural Integral", price: "15,00", image: placeholder, stock: 9 },
        { id: "B2", name: "Mix de Castanhas e Frutas Secas", price: "10,50", image: placeholder, stock: 12 },
        { id: "B3", name: "Água de Coco Natural Gelada", price: "8,00", image: placeholder, stock: 15 },
        { id: "C1", name: "Barra de Proteína Artesanal", price: "9,00", image: placeholder, stock: 7 },
        { id: "C2", name: "Maçã Fuji Orgânica", price: "5,00", image: placeholder, stock: 10 },
        { id: "C3", name: "Kombucha de Gengibre e Limão", price: "14,00", image: placeholder, stock: 4 }
    ];

    useEffect(() => {
        const fetchFoods = async () => {
            try {
               const response =  await axios.get('http://localhost:3000/foods');
               const foodsFromApi = response.data;
               const formattedFoods = foodsFromApi.slice(0,9).map(food => ({
                id: food.id,
                name: food.name,
                price: food.price,
                image: food.imageUrl,
                calories: food.calories,
                carbs: food.carbs,
                proteins: food.proteins,
                fats: food.fats,
                weight: food.weight
               })); 

               setFoodItemsList(formattedFoods);
            } catch (err) {
                console.error("Erro ao buscar alimentos:", err);
            }
        }
        fetchFoods();
    }, []);

    const rows = [
        foodItemsData.filter(item => item.id.startsWith('A')),
        foodItemsData.filter(item => item.id.startsWith('B')),
        foodItemsData.filter(item => item.id.startsWith('C')),
    ];

    const mealMachineStyles = {
        cardStyle: {
            backgroundColor: colors.cardBackgroundDark, color: colors.textLight,
            borderRadius: '0.75rem', border: `1px solid ${colors.darkPrimary}`,
            overflow: 'hidden', position: 'relative', height: '230px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
        },
        imageContainerStyle: { flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' },
        imageStyle: { objectFit: 'contain', maxHeight: '110px', maxWidth: '90%' },
        idStyle: {
            position: 'absolute', top: '10px', left: '10px',
            backgroundColor: `${colors.accent}E6`, color: colors.darkPrimary,
            padding: '0.25rem 0.6rem', borderRadius: '0.3rem', fontSize: '0.85rem', fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
        },
        nameContainerStyle: { padding: '0.25rem 0.5rem', minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        nameStyle: {
            color: colors.textLight, fontSize: '0.9rem', fontWeight: '600',
            lineHeight: '1.2', textAlign: 'center',
            maxHeight: '40px', overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
        },
        priceStyle: {
            backgroundColor: colors.darkPrimary, color: colors.accent,
            padding: '0.5rem', fontSize: '1rem', fontWeight: 'bold', textAlign: 'center',
            borderBottomLeftRadius: '0.75rem', borderBottomRightRadius: '0.75rem'
        },
        infoButtonStyle: {
            position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', padding: '0',
            backgroundColor: `rgba(45, 55, 72, 0.8)`, color: colors.accent,
            border: `1.5px solid ${colors.accent}`, borderRadius: '50%'
        },
        outOfStockOverlayStyle: {
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(26, 32, 44, 0.9)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: colors.danger,
            fontWeight: 'bold', fontSize: '1rem', borderRadius: '0.75rem', textAlign: 'center',
            border: `2px dashed ${colors.danger}`
        }
    };

    return (
        <div className="container-fluid py-3" style={{ backgroundColor: colors.darkPrimary, minHeight: '100vh', overflowX: 'hidden' }}>
            <div className="row mb-3">
                <div className="col-12">
                    <Link
                        to="/"
                        className="btn rounded-pill px-4 py-2"
                        style={{ backgroundColor: colors.accent, color: colors.darkPrimary, fontWeight: 'bold', transition: 'background-color 0.2s ease, transform 0.2s ease' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left-short me-1" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z" />
                        </svg>
                        Voltar
                    </Link>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-8 col-xl-9 mb-4 mb-lg-0">
                    <div className="p-3 rounded-3" style={{ backgroundColor: `${colors.cardBackgroundDark}99` }}>
                        {rows.map((rowItems, rowIndex) => (
                            <div className="row row-cols-3 g-3 mb-3" key={rowIndex}>
                                {rowItems.map((item, colIndex) => (
                                    <motion.div
                                        className="col"
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: (rowIndex * 3 + colIndex) * 0.03 }}
                                    >
                                        <Meal
                                            foodId={item.id}
                                            name={item.name}
                                            img={item.image}
                                            price={item.price}
                                            stock={item.stock}
                                            getInfo={() => getFoodInfo(item.id, item.name)}
                                            selectFood={() => selectFoodOnNumpad(item.id)}
                                            styles={mealMachineStyles}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-lg-4 col-xl-3">
                    <div className="sticky-top" style={{ top: '20px', zIndex: 100 }}>
                        <Numpad
                            colors={colors}
                            initialValue={numpadValue}
                            onConfirm={handleNumpadConfirm}
                            onClear={() => setNumpadValue("")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Machine;