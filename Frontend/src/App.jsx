import React from 'react';
import MenuItemCard from './components/MenuItemCard';
import placeholder from "./assets/images/foodplaceholder.png"; 

const App = () => {
    const colors = {
        darkPrimary: '#1A202C', accent: '#00C9A7', lightNeutral: '#F7FAFC',
        mediumNeutral: '#E2E8F0', textDark: '#2D3748', textLight: '#F7FAFC',
        textSubtleDarkBg: '#A0AEC0', cardBackgroundDark: '#2D3748',
    };

    const getFoodInfo = (foodId, foodName) => {
        const foodItem = foodItemsData.find(f => f.id === foodId);
        alert(`Informações sobre: ${foodName}\nPreço: R$ ${foodItem?.price}\nDescrição: ${foodItem?.description}`);
    };

    const selectFood = (foodId, foodName) => {
        alert(`${foodName} adicionado ao pedido!`);
    };

    const foodItemsData = [
        { id: "meal001", name: "Wrap Mediterrâneo Fit", description: "Tortilha integral recheada com falafel assado, homus caseiro, vegetais frescos e molho tahine light.", price: "22,50", image: placeholder },
        { id: "meal002", name: "Salada Detox Energizante", description: "Mix de folhas verdes, quinoa, sementes de girassol, romã e cubos de frango grelhado ao molho cítrico de laranja e gengibre.", price: "28,00", image: placeholder },
        { id: "meal003", name: "Bowl Oriental Vegano com Tofu", description: "Tofu marinado e grelhado, noodles de arroz integral, brócolis ao vapor, cogumelos shiitake salteados e molho teriyaki com redução de shoyu.", price: "32,00", image: placeholder },
        { id: "meal004", name: "Risoto Cremoso de Cogumelos", description: "Arroz arbóreo preparado com um mix de cogumelos frescos, finalizado com azeite trufado e parmesão.", price: "35,50", image: placeholder },
        { id: "meal005", name: "Smoothie Super Frutas Antioxidante", description: "Combinação potente de açaí orgânico, banana, morango, mirtilo, e whey protein (opcional).", price: "18,00", image: placeholder },
        { id: "meal006", name: "Tacos de Carnitas Frescas", description: "Mini tortilhas de milho com pernil suíno cozido lentamente e desfiado, coentro fresco, cebola roxa e salsa verde artesanal.", price: "26,75", image: placeholder },
    ];

    const menuItemCardStyles = {
        cardStyle: { backgroundColor: colors.cardBackgroundDark, color: colors.textLight, borderRadius: '1rem', overflow: 'hidden', border: `1px solid ${colors.darkPrimary}` },
        imageStyle: { objectFit: 'cover', height: '220px', width: '100%' },
        titleStyle: { color: colors.accent, fontSize: '1.25rem', fontWeight: 'bold' },
        descriptionStyle: { color: colors.textSubtleDarkBg, fontSize: '0.875rem', minHeight: '70px' },
        priceStyle: { color: colors.textLight, fontSize: '1.125rem', fontWeight: 'bold' },
        buttonStyle: { backgroundColor: colors.accent, color: colors.darkPrimary, fontWeight: 'bold', borderColor: colors.accent },
        infoButtonStyle: { backgroundColor: 'transparent', color: colors.accent, borderColor: colors.accent, borderWidth: '2px' }
    };

    return (
        <div style={{ backgroundColor: colors.darkPrimary, color: colors.textLight, minHeight: '100vh' }} className="py-5">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-5 pt-4"
                >
                    <h1 className="display-4 fw-bolder">Nosso Cardápio <span style={{ color: colors.accent }}>Digital</span></h1>
                    <p className="fs-5 mx-auto" style={{ color: colors.textSubtleDarkBg, maxWidth: '600px' }}>
                        Escolha sua refeição favorita e desfrute de uma experiência MealRush!
                    </p>
                </motion.div>

                {foodItemsData.length > 0 ? (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                        {foodItemsData.map((item, index) => (
                            <motion.div
                                className="col d-flex"
                                key={item.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                viewport={{ once: true, amount: 0.1 }}
                            >
                                <MenuItemCard
                                    id={item.id}
                                    name={item.name}
                                    description={item.description}
                                    image={item.image || placeholder}
                                    price={item.price}
                                    styles={menuItemCardStyles}
                                    selectAction={selectFood}
                                    infoAction={getFoodInfo}
                                    selectActionText="Pedir Agora"
                                    infoActionText="Ver Detalhes"
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-5 rounded-3 mt-4" style={{backgroundColor: colors.cardBackgroundDark}}>
                        <p className="fs-4 mb-0" style={{color: colors.textSubtleDarkBg}}>Cardápio indisponível no momento.</p>
                        <p style={{color: colors.textSubtleDarkBg}}>Por favor, tente novamente mais tarde.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;