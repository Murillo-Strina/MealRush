import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatBotUI from '../components/ChatBotUI.jsx';

const API_URL_INSTITUICOES = 'http://localhost:3005/institutions/';
const API_URL_FEEDBACK = 'http://localhost:3015/feedbacks';

const getMockInstitutions = () => [
    { id: '1', name: 'Hospital Central' },
    { id: '2', name: 'Escola Modelo' },
    { id: '3', name: 'Universidade Alpha' },
];

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
        const fetchInstitutions = async () => {
            try {
                const response = await axios.get(API_URL_INSTITUICOES);
                const data = response.data;

                if (Array.isArray(data) && data.length > 0) {
                    if (data.every(item => item.hasOwnProperty('id') && item.hasOwnProperty('name'))) {
                        setInstitutions(data);
                    } else {
                        setInstitutions(getMockInstitutions());
                    }
                } else if (Array.isArray(data) && data.length === 0) {
                    setInstitutions([]);
                } else {
                    setInstitutions(getMockInstitutions());
                }
            } catch (err) {
                setInstitutions(getMockInstitutions());
            }
        };

        fetchInstitutions();
    }, []);

    useEffect(() => {
        if (step === -1) {
            const submitFeedback = async () => {
                if (!feedbackData.experienciaGeral || !feedbackData.instituicao || !feedbackData.data) {
                    addMessage("Algumas informações necessárias para o feedback estão faltando. Por favor, tente novamente.", true);
                    return;
                }

                const selectedInstitutionObject = institutions.find(
                    inst => inst.name && inst.name.toLowerCase() === feedbackData.instituicao.toLowerCase()
                );

                if (!selectedInstitutionObject || typeof selectedInstitutionObject.id === 'undefined') {
                    addMessage(`Não foi possível encontrar o ID para a instituição: ${feedbackData.instituicao}. Verifique se ela foi carregada corretamente.`, true);
                    return;
                }
                const institutionId = selectedInstitutionObject.id;

                const dateParts = feedbackData.data.split('/');
                let formattedOccurrencyDate = null;
                if (dateParts.length === 3) {
                    const day = dateParts[0];
                    const month = dateParts[1];
                    const year = dateParts[2];
                    formattedOccurrencyDate = `${year}-${month}-${day}`;
                } else {
                    addMessage("O formato da data fornecida é inválido para envio.", true);
                    return;
                }

                const payload = {
                    comment: feedbackData.experienciaGeral,
                    occurrency_date: formattedOccurrencyDate,
                    institutionId: institutionId
                };

                try {
                    const response = await axios.post(API_URL_FEEDBACK, payload, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                } catch (err) {
                    let errorMessage = "Ocorreu um erro ao enviar seu feedback.";
                    if (err.response) {
                        errorMessage += ` (Status: ${err.response.status})`;
                        if (err.response.data && typeof err.response.data === 'object' && err.response.data.message) {
                            errorMessage += ` - ${err.response.data.message}`;
                        } else if (err.response.data && typeof err.response.data === 'string') {
                            errorMessage += ` - ${err.response.data}`;
                        }
                    } else if (err.request) {
                        errorMessage += " Nenhuma resposta recebida do servidor.";
                    }
                    addMessage(errorMessage, true);
                }
            };
            
            setTimeout(submitFeedback, 0);
        }
    }, [step, feedbackData, institutions]);


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
            validation: (input) => institutions.some(inst => inst.name && inst.name.toLowerCase() === input.toLowerCase().trim()),
            nextMessage: botMessages.data,
            error: "Instituição não reconhecida. Por favor, escolha uma da lista ou digite o nome corretamente."
        },
        2: {
            field: "data",
            validation: (input) => {
                const dateRegex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(20\d{2})$/;
                if (!dateRegex.test(input)) {
                    return false;
                }

                const [dayStr, monthStr, yearStr] = input.split('/');
                const day = parseInt(dayStr, 10);
                const month = parseInt(monthStr, 10);
                const year = parseInt(yearStr, 10);

                const inputDate = new Date(year, month - 1, day);

                if (
                    inputDate.getFullYear() !== year ||
                    inputDate.getMonth() !== month - 1 ||
                    inputDate.getDate() !== day
                ) {
                    return false;
                }

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (inputDate > today) {
                    return false;
                }
                
                return true;
            },
            nextMessage: botMessages.thankYou,
            error: "Data inválida. Use o formato DD/MM/AAAA, com ano a partir de 2000 e não posterior à data de hoje."
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
        if (!userInput.trim() || step === -1) {
            return;
        }
        
        const currentInput = userInput.trim();
        
        if (step === 1) {
            const currentConfig = stepsMap[step];
            addMessage(currentInput, false);
            setUserInput("");

            if (!currentConfig.validation(currentInput)) {
                currentConfig.error && addMessage(currentConfig.error, true);
                if (institutions.length > 0) {
                    const institutionOptions = institutions.map(inst => ({
                        text: inst.name,
                        value: inst.name
                    }));
                    await delay(800);
                    addMessage({
                        messageType: 'options',
                        questionText: "Por favor, escolha uma das seguintes instituições ou digite o nome corretamente:",
                        options: institutionOptions
                    }, true);
                } else {
                    addMessage(botMessages.instituicaoQuestion, true);
                }
                return;
            }
            setFeedbackData(prevData => ({ ...prevData, instituicao: currentInput }));
            await processBotFlow(1);
            setStep(2);
            return;
        }

        addMessage(currentInput, false);
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
                addMessage("Nenhuma instituição carregada. Por favor, digite o nome da instituição.", true);
            }
            setStep(1);
        } else {
            const currentConfig = stepsMap[step];
            if (!currentConfig.validation(currentInput)) {
                currentConfig.error && addMessage(currentConfig.error, true);
                await delay(400);
                let questionToRepeat = "";
                if (step === 2) questionToRepeat = botMessages.data;
                if(questionToRepeat) addMessage(questionToRepeat, true);
                return;
            }
            setFeedbackData(prevData => ({ ...prevData, [currentConfig.field]: currentInput }));
            const nextStepValue = (step + 1 < Object.keys(stepsMap).length +1 ) ? step + 1 : -1;
            
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