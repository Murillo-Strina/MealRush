import React, { useState } from "react"; // Convertido para funcional e useState
import { motion } from 'framer-motion';
import Meal from "./Meal"; // O Meal.jsx específico para esta interface
import placeholder from "../assets/images/foodplaceholder.png";
import Numpad from "./Numpad";
import MachineInfo from "./MachineInfo";

const Machine = () => {
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
        setNumpadValue(foodId); // Coloca o ID do item no display do numpad
    };

    const handleNumpadConfirm = (value) => {
        const selectedItem = foodItemsData.find(item => item.id.toUpperCase() === value.toUpperCase());
        if (selectedItem) {
            if (selectedItem.stock > 0) {
                alert(`Confirmado: ${selectedItem.name} (ID: ${value}). Preparando seu pedido!`);
                // Aqui iria a lógica de "compra"
            } else {
                alert(`Desculpe, ${selectedItem.name} está esgotado.`);
            }
        } else {
            alert(`Código de item "${value}" inválido.`);
        }
        setNumpadValue(""); // Limpa o display do numpad
    };


    const foodItemsData = [
        { id: "A1", name: "Wrap Vegano Premium", price: "18,50", image: placeholder, stock: 5 },
        { id: "A2", name: "Salada Caesar com Frango", price: "20,00", image: placeholder, stock: 3 },
        { id: "A3", name: "Suco Verde Detoxificante", price: "12,00", image: placeholder, stock: 8 },
        { id: "B1", name: "Sanduíche Natural Integral", price: "15,00", image: placeholder, stock: 0 },
        { id: "B2", name: "Mix de Castanhas e Frutas Secas", price: "10,50", image: placeholder, stock: 12 },
        { id: "B3", name: "Água de Coco Natural Gelada", price: "8,00", image: placeholder, stock: 15 },
        { id: "C1", name: "Barra de Proteína Artesanal", price: "9,00", image: placeholder, stock: 7 },
        { id: "C2", name: "Maçã Fuji Orgânica", price: "5,00", image: placeholder, stock: 10 },
        { id: "C3", name: "Kombucha de Gengibre e Limão", price: "14,00", image: placeholder, stock: 4 }
    ];

    const mealMachineStyles = {
        cardStyle: {
            backgroundColor: colors.cardBackgroundDark, color: colors.textLight,
            borderRadius: '0.75rem', border: `1px solid ${colors.darkPrimary}`,
            overflow: 'hidden', position: 'relative', height: '230px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between' // Para alinhar o preço no rodapé
        },
        imageContainerStyle: { flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' },
        imageStyle: { objectFit: 'contain', maxHeight: '110px', maxWidth: '90%'},
        idStyle: {
            position: 'absolute', top: '10px', left: '10px',
            backgroundColor: `${colors.accent}E6`, color: colors.darkPrimary, // Accent com 90% de opacidade
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
            borderBottomLeftRadius: '0.75rem', borderBottomRightRadius: '0.75rem' // Arredonda com o card
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
            <motion.div 
                initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5}}
                className="row mb-4 g-3 justify-content-center"
            >
                <div className="col-md-6 col-lg-5">
                    <MachineInfo
                        type={"company"}
                        company={"Parceiro MealRush: IMT"}
                        colors={colors}
                    />
                </div>
                <div className="col-md-6 col-lg-5">
                    <MachineInfo
                        type={"id"}
                        id={"MAUA-TEC-007"}
                        colors={colors}
                    />
                </div>
            </motion.div>
            <div className="row">
                <div className="col-lg-8 col-xl-9 mb-4 mb-lg-0">
                    <div className="p-3 rounded-3" style={{backgroundColor: `${colors.cardBackgroundDark}99`}}> {/* Fundo sutil para a grade */}
                        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-3 row-cols-lg-4 row-cols-xl-4 g-3">
                            {foodItemsData.map((item, index) => (
                                <motion.div
                                    className="col"
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.03 }}
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
                    </div>
                </div>
                <div className="col-lg-4 col-xl-3">
                    <div className="sticky-top" style={{ top: '20px', zIndex: 100 }}> {/* zIndex para garantir que fique por cima */}
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