import React, { useState, useEffect, useRef } from 'react';
import ChatBotUI from '../components/ChatBotUI.jsx';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [step, setStep] = useState(0);
    const messagesEndRef = useRef(null);
    const [institutions, setInstitutions] = useState([]);

   useEffect(() => {
  fetch('http://localhost:3015/feedbacks/institutions')
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log('institutions payload:', data);
      // Se vier { rows: [...] }:
      if (Array.isArray(data)) {
        setInstitutions(data);
      } else if (Array.isArray(data.rows)) {
        setInstitutions(data.rows);
      } else {
        console.error('Formato inesperado:', data);
        setInstitutions([]);
      }
    })
    .catch(err => {
      console.error("Erro ao buscar instituições:", err);
      setInstitutions([]);
    });
}, []);


    const botMessages = {
        greeting: "Olá! Seja bem-vindo(a) à área de feedback da MealRush! Conte para nós como foi sua experiência.",
        stored: "Sua avaliação foi armazenada para nossa base de dados! Usaremos ela para continuar nos aprimorando.",
        prompt: "Por favor, responda às seguintes questões:",
        instituicao: "Qual a instituição que você teve acesso ao nosso serviço?",
        data: "Qual a data que você teve esta experiência? Responda com DD/MM/AAAA",
        thankYou: "Obrigado pelo feedback! Esperamos você para sua próxima refeição!"
    };

    const stepsMap = {
        1: { field: "instituicao", validation: () => true, nextMessage: botMessages.data },
        2: { field: "data", validation: (input) => /^\d{2}\/\d{2}\/\d{4}$/.test(input), nextMessage: botMessages.thankYou, error: "Formato de data inválido! Use DD/MM/AAAA" }
    };

    const addMessage = (text, isBot) => {
        setMessages((prev) => [...prev, { text, isBot, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    };

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => {
        sessionStorage.removeItem("chatMessages");
        setMessages([]);
        addMessage(botMessages.greeting, true);
        scrollToBottom();
    }, []);

    useEffect(() => scrollToBottom(), [messages]);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const processBotFlow = async (currentStep) => {
        if (stepsMap[currentStep]) {
            await delay(800);
            addMessage(stepsMap[currentStep].nextMessage, true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || step === -1) return;
        addMessage(userInput, false);
        if (step === 0) {
            await delay(800);
            addMessage(botMessages.stored, true);
            await delay(800);
            addMessage(botMessages.prompt, true);
            await delay(800);
            addMessage(botMessages.instituicao, true);
            setStep(1);
        } else {
            const currentConfig = stepsMap[step];
            if (!currentConfig.validation(userInput)) {
                currentConfig.error && addMessage(currentConfig.error, true);
                return;
            }
            setStep(stepsMap[step + 1] ? step + 1 : -1);
            await processBotFlow(step);
        }
        setUserInput("");
    };

    return (
        <ChatBotUI
            messages={messages}
            userInput={userInput}
            handleSubmit={handleSubmit}
            setUserInput={setUserInput}
            messagesEndRef={messagesEndRef}
            institutions={institutions}
            step={step}
        />
    );
};

export default ChatBot;