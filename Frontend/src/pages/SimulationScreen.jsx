import axios from 'axios';
import React, { useState, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Meal from "../components/Meal.jsx";
import Numpad from "../components/Numpad.jsx";

const SimulationScreen = () => {
    const [institutions, setInstitutions] = useState([]);
    const [machines, setMachines] = useState([]);
    const [selectedInstitution, setSelectedInstitution] = useState('');
    const [selectedMachine, setSelectedMachine] = useState('');
    const [foodItemsData, setFoodItemsData] = useState([]);
    const [numpadValue, setNumpadValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [allFoods, setAllFoods] = useState([]);

    const colors = {
        darkPrimary: '#1A202C', accent: '#00C9A7', cardBackgroundDark: '#2D3748',
        textLight: '#F7FAFC', textSubtleDarkBg: '#A0AEC0', mediumNeutral: '#E2E8F0',
        danger: '#E53E3E',
    };

    const formSelectStyle = {
        backgroundColor: colors.cardBackgroundDark,
        color: colors.textLight,
        border: `1px solid ${colors.accent}`,
        borderRadius: '0.375rem',
        padding: '0.5rem 1rem',
        width: '100%',
        marginBottom: '1rem',
    };

    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const response = await axios.get('http://localhost:3005/institutions');
                setInstitutions(response.data);
            } catch (err) {
                console.error("Erro ao buscar instituições:", err);
                alert("Não foi possível carregar as instituições.");
            }
        };
        fetchInstitutions();
    }, []);

    useEffect(() => {
        const fetchAllFoods = async () => {
            try {
                const response = await axios.get('http://localhost:3000/foods');
                setAllFoods(response.data);
            } catch (err) {
                console.error("Erro ao buscar a lista de todas as comidas:", err);
                alert("Não foi possível carregar o catálogo de comidas.");
            }
        };
        fetchAllFoods();
    }, []);

    useEffect(() => {
        if (!selectedInstitution) {
            setMachines([]);
            setSelectedMachine('');
            setFoodItemsData([]);
            return;
        }
        const fetchMachines = async () => {
            try {
                const response = await axios.get(`http://localhost:3010/machines/institution/${selectedInstitution}`);
                setMachines(response.data);
                setSelectedMachine('');
                setFoodItemsData([]);
            } catch (err) {
                console.error("Erro ao buscar máquinas:", err);
                setMachines([]);
                setFoodItemsData([]);
                alert("Não foi possível carregar as máquinas para esta instituição.");
            }
        };
        fetchMachines();
    }, [selectedInstitution]);

    const fetchMachineContents = useCallback(async () => {
        if (!selectedMachine || allFoods.length === 0) {
            setFoodItemsData([]);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3025/contents/machine/${selectedMachine}`);
            const contentsFromApi = response.data;

            const formattedFoods = contentsFromApi.slice(0, 9).map((contentItem, index) => {
                const foodDetails = allFoods.find(food => food.name === contentItem.foodName);
                return {
                    contentId: contentItem.id,
                    displayId: String(index + 1),
                    name: contentItem.foodName,
                    stock: Number(contentItem.qtd_itens),
                    sales: Number(contentItem.sales),
                    sellprice: Number(contentItem.sellprice),
                    buyprice: Number(contentItem.buyprice),
                    image: foodDetails?.imageUrl,
                    weight: foodDetails?.weight,
                    calories: foodDetails?.calories,
                    carbs: foodDetails?.carbs,
                    proteins: foodDetails?.proteins,
                    fats: foodDetails?.fats
                };
            });
            
            setFoodItemsData(formattedFoods);
        } catch (err) {
            console.error("Erro ao buscar alimentos da máquina:", err);
            if (err.response && err.response.status === 404) {
                setFoodItemsData([]);
            } else {
                alert("Erro ao carregar os itens da máquina.");
            }
        } finally {
            setLoading(false);
        }
    }, [selectedMachine, allFoods]);

    useEffect(() => {
        fetchMachineContents();
    }, [fetchMachineContents]);

    const getFoodInfo = (displayId) => {
        const foodItem = foodItemsData.find((f) => f.displayId === displayId);
        if (foodItem) {
            alert(`Detalhes de ${foodItem.name}:\nID: ${displayId}\nPreço: R$ ${foodItem.sellprice?.toFixed(2)}\nEstoque: ${foodItem.stock}\nPeso: ${foodItem.weight}g\nCalorias: ${foodItem.calories}\nCarboidratos: ${foodItem.carbs}g\nProteínas: ${foodItem.proteins}g\nGorduras: ${foodItem.fats}g`);
        }
    };

    const selectFoodOnNumpad = (foodId) => {
        setNumpadValue(foodId);
    };

    const handleNumpadConfirm = async (value) => {
        if (!selectedMachine) {
            alert("Por favor, selecione uma instituição e uma máquina primeiro.");
            setNumpadValue("");
            return;
        }

        const selectedItem = foodItemsData.find(item => item.displayId === value);

        if (selectedItem) {
            if (selectedItem.stock > 0) {
                try {
                    const payload = {
                        qtdItens: selectedItem.stock - 1,
                        sales: selectedItem.sales + 1,
                        foodName: selectedItem.name,
                        sellprice: selectedItem.sellprice,
                        buyprice: selectedItem.buyprice,
                    };

                    await axios.put(`http://localhost:3025/contents/${selectedItem.contentId}/machine/${selectedMachine}`, payload);

                    alert(`Compra confirmada: ${selectedItem.name} (ID: ${value}).\nRetire seu pedido!`);
                    await fetchMachineContents();

                } catch (err) {
                    console.error("Erro ao processar a compra:", err);
                    alert(`Ocorreu um erro ao tentar comprar ${selectedItem.name}. Tente novamente.`);
                }
            } else {
                alert(`Desculpe, ${selectedItem.name} está esgotado.`);
            }
        } else {
            alert(`Código de item "${value}" inválido para esta máquina.`);
        }
        setNumpadValue("");
    };

    const rows = [
        foodItemsData.slice(0, 3),
        foodItemsData.slice(3, 6),
        foodItemsData.slice(6, 9)
    ];

    const mealMachineStyles = {
        cardStyle: { backgroundColor: colors.cardBackgroundDark, color: colors.textLight, borderRadius: '0.75rem', border: `1px solid ${colors.darkPrimary}`, overflow: 'hidden', position: 'relative', height: '230px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
        imageContainerStyle: { flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' },
        imageStyle: { objectFit: 'contain', maxHeight: '110px', maxWidth: '90%' },
        idStyle: { position: 'absolute', top: '10px', left: '10px', backgroundColor: `${colors.accent}E6`, color: colors.darkPrimary, padding: '0.25rem 0.6rem', borderRadius: '0.3rem', fontSize: '0.85rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' },
        nameContainerStyle: { padding: '0.25rem 0.5rem', minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        nameStyle: { color: colors.textLight, fontSize: '0.9rem', fontWeight: '600', lineHeight: '1.2', textAlign: 'center', maxHeight: '40px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' },
        priceStyle: { backgroundColor: colors.darkPrimary, color: colors.accent, padding: '0.5rem', fontSize: '1rem', fontWeight: 'bold', textAlign: 'center', borderBottomLeftRadius: '0.75rem', borderBottomRightRadius: '0.75rem' },
        infoButtonStyle: { position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', padding: '0', backgroundColor: `rgba(45, 55, 72, 0.8)`, color: colors.accent, border: `1.5px solid ${colors.accent}`, borderRadius: '50%' },
        outOfStockOverlayStyle: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(26, 32, 44, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.danger, fontWeight: 'bold', fontSize: '1rem', borderRadius: '0.75rem', textAlign: 'center', border: `2px dashed ${colors.danger}` }
    };

    return (
        <div className="container-fluid py-3" style={{ backgroundColor: colors.darkPrimary, minHeight: '100vh', overflowX: 'hidden' }}>
            <div className="row mb-3">
                <div className="col-12">
                    <Link to="/" className="btn rounded-pill px-4 py-2" style={{ backgroundColor: colors.accent, color: colors.darkPrimary, fontWeight: 'bold', transition: 'background-color 0.2s ease, transform 0.2s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
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
                                    <motion.div className="col" key={item.contentId} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: (rowIndex * 3 + colIndex) * 0.03 }}>
                                        <Meal
                                            foodId={item.displayId}
                                            name={item.name}
                                            img={item.image}
                                            sellprice={item.sellprice}
                                            stock={item.stock}
                                            getInfo={() => getFoodInfo(item.displayId)}
                                            selectFood={() => selectFoodOnNumpad(item.displayId)}
                                            styles={mealMachineStyles}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        ))}
                        {loading && <p style={{ color: colors.textLight, textAlign: 'center' }}>Carregando itens...</p>}
                        {!loading && foodItemsData.length === 0 && selectedMachine && <p style={{ color: colors.textLight, textAlign: 'center' }}>Esta máquina está vazia ou não possui itens cadastrados.</p>}
                        {!selectedMachine && <p style={{ color: colors.textLight, textAlign: 'center' }}>Selecione uma instituição e uma máquina para ver os itens.</p>}
                    </div>
                </div>
                <div className="col-lg-4 col-xl-3">
                    <div className="sticky-top" style={{ top: '20px', zIndex: 100 }}>
                        <div style={{ backgroundColor: colors.cardBackgroundDark, padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                            <select style={formSelectStyle} value={selectedInstitution} onChange={e => setSelectedInstitution(e.target.value)}>
                                <option value="">1. Selecione uma Instituição</option>
                                {institutions.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
                            </select>
                            <select
                                style={formSelectStyle}
                                value={selectedMachine}
                                onChange={e => setSelectedMachine(e.target.value)}
                                disabled={!selectedInstitution || machines.length === 0}
                            >
                                <option value="">2. Selecione uma Máquina</option>
                                {machines.map(mach => (
                                    <option key={mach.machineId} value={mach.machineId}>
                                        {mach.machineId}
                                    </option>
                                ))}
                            </select>
                        </div>
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

export default SimulationScreen;