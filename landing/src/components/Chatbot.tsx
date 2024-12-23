'use client';
import AuthSvg from '@/assets/AuthSvg';
import React, { useState, useCallback } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: input,
        user: 'You',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, newMessage]);
      setInput('');

      try {
        const response = await fetch(
          'http://vniu.southeastasia.cloudapp.azure.com/api/v1/chat-messages/chatbot',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ content: input }),
          }
        );
        console.log('🚀 ~ handleSend ~ response:', response);

        const data = await response.json();
        const chatbotResponseData = data.value;

        const botMessage = {
          id: messages.length + 2,
          text: chatbotResponseData.content,
          user: 'Bot',
          timestamp: new Date(
            chatbotResponseData.createdDate
          ).toLocaleTimeString(),
          image: chatbotResponseData.imageUrl
            ? chatbotResponseData.imageUrl
            : undefined,
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div>
      <button
        onClick={toggleChatbot}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg"
      >
        <div>{AuthSvg.chatbot()}</div>
      </button>
      {isOpen && (
        <div className="fixed bottom-16 right-4 w-full max-w-md lg:max-w-lg xl:max-w-xl h-96 lg:h-[32rem] xl:h-[36rem] bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
          <div className="p-4 flex-grow overflow-y-auto">
            <h2 className="text-lg font-bold">Chatbot</h2>
            <div className="mt-4 flex flex-col space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-2 rounded ${
                    message.user === 'You'
                      ? 'bg-blue-100 self-end'
                      : 'bg-gray-100 self-start'
                  }`}
                >
                  <div className="text-sm">{message.text}</div>
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Chatbot response"
                      className="mt-2 max-w-full h-auto rounded"
                    />
                  )}
                  <div className="text-xs text-gray-500">
                    {message.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-2 border-t border-gray-300 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-l"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white p-2 rounded-r"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
