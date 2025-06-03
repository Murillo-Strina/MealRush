import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { color, motion } from 'framer-motion';
import logo from "../assets/images/logo_mealrush.png";
import logoIMT from "../assets/images/logo-IMT.png";
import logoFEI from "../assets/images/logo_fei_color-01.svg";
import logoUSP from "../assets/images/USP.jpg";
import logoCongonhas from "../assets/images/logo_congonhas.png";
import logoIbirapuera from "../assets/images/logo_ibira.png";
import logoSCS from "../assets/images/logo_SCS.jpg";
import logoSA from "../assets/images/logo_SA.jpg";
import logoSBC from "../assets/images/logo_SBC.png";
import vendingMachine from "../assets/images/vending_machine.png";

import MenuItemCard from '../components/MenuItemCard';
import Carousel from '../components/Carousel';

const MainMenu = () => {

    const [foodItemsList, setFoodItemsList] = useState([]);

    const colors = {
        darkPrimary: '#1A202C', accent: '#00C9A7', lightNeutral: '#F7FAFC',
        mediumNeutral: '#E2E8F0', textDark: '#2D3748', textLight: '#F7FAFC',
        textSubtleDarkBg: '#A0AEC0', cardBackgroundDark: '#2D3748',
        textSubtleLightBg: '#718096',
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };
    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
    };
    const heroItemLeftVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2 } }
    };
    const heroItemRightVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.4 } }
    };

    useEffect(() => {
        const fetchFoods = async () =>{
            try {
                const response = await axios.get('http://localhost:3000/foods');
                const foodsFromAPI = response.data;
                const formattedFoods = foodsFromAPI.slice(0, 6).map(food => ({
                    id: food.id,
                    name: food.name,
                    image: food.imageUrl,
                    price: food.price 
                }));

                setFoodItemsList(formattedFoods);
            } catch (err) {
                console.error("Erro ao buscar os alimentos:", err);
            }
        };

        fetchFoods()
    }, [])

    const partnerLogos = [logoIMT, logoFEI, logoUSP, logoCongonhas, logoIbirapuera, logoSCS, logoSA, logoSBC];

    const menuItemCardStyles = {
        cardStyle: { backgroundColor: colors.cardBackgroundDark, color: colors.textLight, borderRadius: '1rem', overflow: 'hidden', border: `1px solid ${colors.darkPrimary}` },
        imageStyle: { objectFit: 'cover', objectPosition: 'center', height: '200px', width: '100%' },
        titleStyle: { color: colors.accent, fontSize: '1.15rem', fontWeight: 'bold' },
        priceStyle: { color: colors.textLight, fontSize: '1.05rem', fontWeight: 'bold' },
        buttonStyle: { backgroundColor: colors.accent, color: colors.darkPrimary, fontWeight: 'bold', borderColor: colors.accent },
        infoButtonStyle: { backgroundColor: 'transparent', color: colors.accent, borderColor: colors.accent, borderWidth: '2px' }
    };

    return (
        <div style={{ backgroundColor: colors.lightNeutral, color: colors.textDark, paddingTop: '80px' }}>
            <nav
                className="navbar navbar-expand-lg fixed-top py-3 shadow-sm"
                style={{ backgroundColor: 'rgba(26, 32, 44, 0.90)', backdropFilter: 'blur(10px)' }}
            >
                <div className="container">
                    <Link className="navbar-brand d-flex align-items-center" to="/" style={{ color: colors.textLight }}>
                        <img src={logo} alt="MealRush Logo" width="75" height="55" className="d-inline-block align-top me-2 rounded justify-content-center" />
                        <span className="fs-4 fw-bold justify-content-center">MealRush</span>
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNavMainMenu"
                        aria-controls="navbarNavMainMenu"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        style={{ borderColor: colors.accent, outline: 'none', boxShadow: 'none', }}
                    >
                        <span className="navbar-toggler-icon" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='${encodeURIComponent(colors.accent)}' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")`, }}></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNavMainMenu">
                        <ul className="navbar-nav align-items-center">
                            {['Alimentos', 'Parcerias'].map(item => (
                                <li className="nav-item mx-lg-1" key={item}>
                                    <a className="nav-link px-2" href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} style={{ color: colors.textSubtleDarkBg, fontWeight: 500, transition: 'color 0.2s ease-in-out' }}
                                        onMouseOver={e => e.currentTarget.style.color = colors.accent}
                                        onMouseOut={e => e.currentTarget.style.color = colors.textSubtleDarkBg}
                                    >
                                        {item.replace(' ', '')}
                                    </a>
                                </li>
                            ))}
                            <li className="nav-item mx-lg-1">
                                <Link className="nav-link px-2" to="/simulation" style={{ color: colors.textSubtleDarkBg, fontWeight: 500, transition: 'color 0.2s ease-in-out' }}
                                    onMouseOver={e => e.currentTarget.style.color = colors.accent}
                                    onMouseOut={e => e.currentTarget.style.color = colors.textSubtleDarkBg}
                                >Simulação</Link>
                            </li>
                            <li className="nav-item mx-lg-1">
                                <Link className="nav-link px-2" to="/chatbot" style={{ color: colors.textSubtleDarkBg, fontWeight: 500, transition: 'color 0.2s ease-in-out' }}
                                    onMouseOver={e => e.currentTarget.style.color = colors.accent}
                                    onMouseOut={e => e.currentTarget.style.color = colors.textSubtleDarkBg}
                                >ChatBot</Link>
                            </li>
                            <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                                <Link className="btn rounded-pill px-4 py-2" to="/login" style={{ backgroundColor: colors.accent, color: colors.darkPrimary, fontWeight: 'bold', transition: 'background-color 0.2s ease, transform 0.2s ease' }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    Login Admin
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <header className="py-5 text-white" style={{ backgroundColor: colors.darkPrimary, display: 'flex', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
                <div className="container">
                    <div className="row align-items-center g-5 py-lg-5">
                        <motion.div
                            className="col-lg-6 text-center text-lg-start"
                            variants={heroItemLeftVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <h1 className="display-3 fw-bolder lh-1 mb-4" style={{ color: colors.textLight }}>
                                A Revolução da <span style={{ color: colors.accent }}>Alimentação Saudável</span> Chegou.
                            </h1>
                            <p className="lead fs-5 mb-4" style={{ color: colors.textSubtleDarkBg }}>
                                Descubra refeições gourmet, frescas e nutritivas, prontas em instantes. MealRush é a sua pausa inteligente para um dia a dia mais saboroso e saudável.
                            </p>
                            <div className="d-grid gap-2 d-sm-flex justify-content-evenly">
                                <a href="#alimentos" className="btn btn-lg px-4 me-sm-2 rounded-pill" style={{ backgroundColor: colors.accent, color: colors.darkPrimary, fontWeight: 'bold' }}>
                                    Explorar Cardápio
                                </a>
                            </div>
                        </motion.div>
                        <motion.div
                            className="col-10 col-sm-8 col-lg-6 mx-auto"
                            variants={heroItemRightVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <img src={vendingMachine} alt="MealRush Vending Machine Moderna" className="d-block mx-lg-auto img-fluid rounded-3 shadow-lg" style={{ filter: `drop-shadow(0 0 2rem ${colors.accent}40)` }} loading="lazy" />
                        </motion.div>
                    </div>
                </div>
            </header>

            <motion.section>
                <div className="container col-xl-10 col-xxl-8 px-4 py-5">
                    <div className="row align-items-center g-lg-5 py-5">
                        <motion.div className="col-lg-7 text-center text-lg-start" variants={itemVariants}>
                            <h2 className="display-5 fw-bold lh-1 mb-4" style={{ color: colors.textDark }}>
                                Inovação e Sabor em Cada <span style={{ color: colors.accent }}>Detalhe</span>.
                            </h2>
                            <p className="col-lg-10 fs-5 mb-4" style={{ color: colors.textSubtleLightBg }}>
                                Fundada com a visão de transformar a alimentação rápida, a MealRush combina tecnologia de ponta com ingredientes frescos para oferecer uma experiência culinária única, acessível e incrivelmente saudável.
                            </p>
                            <p className="col-lg-10 fs-5" style={{ color: colors.textSubtleLightBg }}>
                                Nossas vending machines inteligentes são mais que simples máquinas: são portais para um mundo de nutrição e conveniência, projetadas para o seu bem-estar.
                            </p>
                        </motion.div>
                        <motion.div className="col-md-10 mx-auto col-lg-5" variants={itemVariants}>
                            <div className="p-4 p-md-5 border-0 rounded-4 shadow-lg" style={{ backgroundColor: colors.darkPrimary }}>
                                <img src={logo} alt="MealRush Logo Detalhe" className="img-fluid rounded-3 mb-4 mx-auto d-block" style={{ maxWidth: '200px' }} />
                                <h3 className="fw-bold mb-3 text-center" style={{ color: colors.accent }}>Nossa Missão</h3>
                                <p className="text-center" style={{ color: colors.textSubtleDarkBg }}>
                                    Tornar a alimentação saudável uma escolha fácil e prazerosa para todos, todos os dias.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

           <motion.section
                id="alimentos"
                className="py-5"
                style={{ backgroundColor: colors.darkPrimary, color: colors.textLight }}
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                <div className="container px-4 py-5">
                    <h2 className="display-5 fw-bold text-center mb-3">Cardápio <span style={{ color: colors.accent }}>Exclusivo</span></h2>
                    <p className="fs-5 text-center mb-5 mx-auto" style={{ color: colors.textSubtleDarkBg, maxWidth: '700px' }}>
                        Criações pensadas para nutrir seu corpo e encantar seu paladar, disponíveis em nossas máquinas inteligentes.
                    </p>
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                        {foodItemsList.map((food, index) => (
                            <motion.div
                                className="col d-flex"
                                key={food.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                viewport={{ once: true, amount: 0.1 }}
                            >
                                <MenuItemCard
                                    id={food.id}
                                    name={food.name}
                                    image={food.image}
                                    price={food.price}
                                    styles={menuItemCardStyles}
                                />
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-center mt-5">
                        <Link to="/simulation" className="btn btn-lg rounded-pill px-5 py-3" style={{ ...menuItemCardStyles.buttonStyle, fontSize: '1.1rem' }}>
                            Ver Todas as Opções
                        </Link>
                    </div>
                </div>
            </motion.section>

            <motion.section
                id="parcerias"
                className="py-5"
                style={{ backgroundColor: colors.lightNeutral }}
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="container py-5">
                    <h2 className="display-5 fw-bold text-center mb-3" style={{ color: colors.textDark }}>
                        Parceiros que <span style={{ color: colors.accent }}>Acreditam</span> na Inovação
                    </h2>
                    <p className="fs-5 text-center mb-5 mx-auto" style={{ color: colors.textSubtleLightBg, maxWidth: '700px' }}>
                        Colaboramos com instituições e empresas que compartilham nossa visão de bem-estar, tecnologia e alimentação de qualidade.
                    </p>
                    <div className="mt-4">
                        <Carousel images={partnerLogos} accentColor={colors.accent} itemsPerSlideDesktop={4} itemsPerSlideMobile={2} />
                    </div>
                </div>
            </motion.section>

            <footer className="py-5 text-center" style={{ backgroundColor: colors.darkPrimary, color: colors.textSubtleDarkBg }}>
                <div className="container">
                    <Link to="/" className="d-inline-block mb-3">
                        <img src={logo} alt="MealRush Logo Footer" height="50" width="75" className="rounded" />
                    </Link>
                    <p className="mb-1">&copy; {new Date().getFullYear()} MealRush. Todos os direitos reservados.</p>
                    <p className="mb-0">
                        <span className="mx-2" style={{ color: colors.accent }}>Termos de Uso</span>
                        |
                        <span className="mx-2" style={{ color: colors.accent }}>Política de Privacidade</span>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default MainMenu;