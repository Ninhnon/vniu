'use client';
import AuthSvg from '@/assets/AuthSvg';
import { getRequest, postRequest } from '@/lib/fetch';
import React, { useState, useRef } from 'react';
import { Zoom } from './ui/zoom-image';
import { Card } from '@/components/ui/card';
import { ImagePlus, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useImage } from '@/hooks/useImage';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();
  const { onUploadImage } = useImage();
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleImageUpload = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await onUploadImage({
        formData: formData,
        callback: () => {},
      });

      return response[0];
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const fetchProducts = async (productIdsUrl) => {
    try {
      const response = await fetch(productIdsUrl);
      const data = await response.json();
      console.log('🚀 ~ fetchProducts ~ data:', data);
      return data.value.items || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
    }
  };

  const handleSend = async () => {
    if (input.trim() || imageFile) {
      setIsLoading(true);
      let imageUrl = '';

      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      const newMessage = {
        id: messages.length + 1,
        text: input,
        user: 'You',
        timestamp: new Date().toLocaleTimeString(),
        image: imageUrl,
      };

      setMessages([...messages, newMessage]);
      setInput('');
      setImageFile(null);

      try {
        const tt = `${input} ${imageUrl ? imageUrl : ''}`;
        // Send message and image to get product IDs URL
        console.log('🚀 ~ handleSend ~ tt:', tt);
        const response = await postRequest({
          endPoint: '/api/v1/chat-messages/chatbot',
          formData: {
            content: `${input} ${imageUrl ? imageUrl : ''}`,
          },
          isFormData: false,
        });
        console.log('🚀 ~ handleSend ~ response:', response);

        // The response should contain the product IDs URL
        const productIdsUrl = response.value.content;
        console.log('🚀 ~ handleSend ~ productIdsUrl:', productIdsUrl);

        // Fetch products using the URL

        let products = [];
        if (productIdsUrl.includes('https')) {
          products = await fetchProducts(productIdsUrl);
        }
        console.log('🚀 ~ handleSend ~ products:', products);

        const botMessage = !productIdsUrl.includes('https')
          ? {
              id: messages.length + 2,
              text: productIdsUrl,
              user: 'Bot',
              image: response.value.imageUrl
                ? response.value.imageUrl
                : undefined,
              timestamp: new Date().toLocaleTimeString(),
            }
          : {
              id: messages.length + 2,
              text:
                products.length > 0
                  ? 'Here are some products that match your request:'
                  : 'No products found. you can try with another request',
              user: 'Bot',
              timestamp: new Date().toLocaleTimeString(),
              products: products,
            };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error processing request:', error);

        const errorMessage = {
          id: messages.length + 2,
          text: 'Sorry, I encountered an error processing your request. Please try again.',
          user: 'Bot',
          timestamp: new Date().toLocaleTimeString(),
        };

        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsLoading(false);
        imageUrl = '';
      }
    }
  };

  const ProductCard = ({ product }) => (
    <Card
      className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/product/${product.id}`)}
    >
      <img
        src={product.productImages[0].imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg mb-2"
      />
      <h3 className="font-semibold text-lg truncate">{product.name}</h3>
      <p className="text-blue-600 font-medium">
        ${product.salePriceMin.toLocaleString()}
      </p>
    </Card>
  );

  return (
    <div>
      <button
        onClick={toggleChatbot}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        <div>{AuthSvg.chatbot()}</div>
      </button>
      {isOpen && (
        <div className="fixed bottom-16 right-4 w-full max-w-md lg:max-w-lg xl:max-w-xl h-96 lg:h-[36rem] xl:h-[36rem] bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
          <h2 className="p-4 text-lg font-bold border-b">Chatbot</h2>
          <div className="p-4 flex-grow overflow-y-auto">
            <div className="mt-4 flex flex-col space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.user === 'You'
                      ? 'bg-blue-100 self-end'
                      : 'bg-gray-100 self-start'
                  }`}
                >
                  <div className="text-sm">{message.text}</div>
                  {message.image && (
                    <Zoom>
                      <img
                        src={message.image}
                        alt="Uploaded image"
                        className="mt-2 max-w-full h-auto rounded-lg"
                      />
                    </Zoom>
                  )}
                  {message.products && (
                    <div className="mt-4 grid grid-cols-1 gap-4">
                      {message.products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 border-t border-gray-300">
            {imageFile && (
              <div className="mb-2 p-2 bg-gray-100 rounded flex items-center justify-between">
                <span className="text-sm truncate">{imageFile.name}</span>
                <button
                  onClick={() => setImageFile(null)}
                  className="text-red-500 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:border-blue-500"
                placeholder="Type a message..."
                onKeyPress={(e) =>
                  e.key === 'Enter' && !isLoading && handleSend()
                }
                disabled={isLoading}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="p-2 text-gray-500 hover:text-gray-700"
                disabled={isLoading || isUploading}
              >
                <ImagePlus size={20} />
              </button>
              <button
                onClick={handleSend}
                disabled={
                  isLoading || isUploading || (!input.trim() && !imageFile)
                }
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
