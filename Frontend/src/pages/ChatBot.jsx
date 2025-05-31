import React, { useState, useEffect, useRef } from 'react';
import ChatBotUI from '../components/ChatBotUI.jsx';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [step, setStep] = useState(0);
    const messagesEndRef = useRef(null);
    const [institutions, setInstitutions] = useState([]);

    const [feedbackData, setFeedbackData] = useState({
        experienciaGeral: null,
        instituicao: null,
        data: null,
    });

    useEffect(() => {
        /*
        fetch('API_PARA_BUSCAR_INSTITUICOES')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setInstitutions(data);
                } else if (Array.isArray(data.rows)) { 
                    setInstitutions(data.rows);
                } else {
                    console.error('Formato inesperado para instituições da API:', data);
                    setInstitutions([]);
                }
            })
            .catch(err => {
                console.error("Erro ao buscar instituições da API:", err);
                setInstitutions([]); 
            });
        */

        const mockInstitutions = [
            { id: 1, name: "FEI" },
            { id: 2, name: "IMT" },
            { id: 3, name: "Igreja do PAPA vinicius" }
        ];
        setInstitutions(mockInstitutions);
    }, []);

    useEffect(() => {
        if (step === -1) {
            setTimeout(() => {
                console.log("FINAL: Dados do feedback coletados:", feedbackData);
                /*
                fetch('API_PARA_SALVAR_FEEDBACK', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(feedbackData),
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json(); 
                })
                .then(responseData => {
                    console.log("Feedback enviado com sucesso:", responseData);
                })
                .catch(err => {
                    console.error("Erro ao enviar feedback para a API:", err);
                });
                */
            }, 0);
        }
    }, [step, feedbackData]); 


    const botMessages = {
        greeting: "Olá! Seja bem-vindo(a) à área de feedback da MealRush! Conte para nós como foi sua experiência.",
        stored: "Sua avaliação foi armazenada para nossa base de dados! Usaremos ela para continuar nos aprimorando.",
        prompt: "Por favor, responda às seguintes questões:",
        instituicaoQuestion: "Qual a instituição que você teve acesso ao nosso serviço?",
        data: "Qual a data que você teve esta experiência? Responda com DD/MM/AAAA",
        thankYou: "Obrigado pelo feedback! Esperamos você para sua próxima refeição!"
    };

    const stepsMap = {
        1: { 
            field: "instituicao",
            validation: (input) => institutions.some(inst => inst.name.toLowerCase() === input.toLowerCase().trim()),
            nextMessage: botMessages.data,
            error: "Instituição não reconhecida."
        },
        2: {
            field: "data",
            validation: (input) => {
                const isValid = /^\d{2}\/\d{2}\/\d{4}$/.test(input);
                return isValid;
            },
            nextMessage: botMessages.thankYou,
            error: "Formato de data inválido! Use DD/MM/AAAA (ex: 01/12/2025)"
        }
    };

    const addMessage = (content, isBot) => {
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        if (typeof content === 'string') {
            setMessages(prev => [...prev, { text: content, isBot, time }]);
        } else { 
            setMessages(prev => [...prev, { ...content, isBot, time }]);
        }
    };

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => {
        setMessages([]);
        addMessage(botMessages.greeting, true);
        scrollToBottom();
    }, []);

    useEffect(() => scrollToBottom(), [messages]);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const processBotFlow = async (currentProcessingStep) => {
        if (stepsMap[currentProcessingStep] && stepsMap[currentProcessingStep].nextMessage) {
            await delay(800);
            addMessage(stepsMap[currentProcessingStep].nextMessage, true);
        }
    };

    const handleOptionClick = async (institutionName) => {
        if (step !== 1) return;

        addMessage(institutionName, false);
        setFeedbackData(prevData => ({ ...prevData, instituicao: institutionName }));

        await processBotFlow(1);
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || step === -1 || step === 1) {
            return;
        }
        
        addMessage(userInput, false);
        const currentInput = userInput;
        setUserInput("");

        if (step === 0) {
            setFeedbackData(prevData => ({ ...prevData, experienciaGeral: currentInput }));

            await delay(800);
            addMessage(botMessages.stored, true);
            await delay(800);
            addMessage(botMessages.prompt, true);
            await delay(800);
            addMessage(botMessages.instituicaoQuestion, true);
            
            if (institutions.length > 0) {
                const institutionOptions = institutions.map(inst => ({
                    text: inst.name,
                    value: inst.name
                }));
                await delay(800);
                addMessage({
                    messageType: 'options',
                    questionText: "Você pode escolher uma das seguintes instituições:",
                    options: institutionOptions
                }, true);
            } else {
                await delay(800);
                addMessage("Não foi possível carregar a lista de instituições. Por favor, tente novamente mais tarde.", true);
                setStep(-1); 
                return;
            }
            setStep(1);
        } else { 
            const currentConfig = stepsMap[step];
            if (!currentConfig.validation(currentInput)) {
                currentConfig.error && addMessage(currentConfig.error, true);
                return;
            }
            setFeedbackData(prevData => ({ ...prevData, [currentConfig.field]: currentInput }));

            const nextStepValue = stepsMap[step + 1] ? step + 1 : -1;
            
            await processBotFlow(step);
            setStep(nextStepValue);
        }
    };

    return (
        <ChatBotUI
            messages={messages}
            userInput={userInput}
            handleSubmit={handleSubmit}
            setUserInput={setUserInput}
            messagesEndRef={messagesEndRef}
            step={step}
            handleOptionClick={handleOptionClick}
        />
    );
};

export default ChatBot;