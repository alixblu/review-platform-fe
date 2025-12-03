import { useState, useRef, useEffect } from 'react';
import axios from '../Util/axios';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const userId = localStorage.getItem('userId') || 'guest';
      const response = await axios.post('/api/chat', {
        message: userMessage,
        userId: userId
      });

      // Add AI response
      setMessages(prev => [...prev, {
        type: 'ai',
        content: response.data.message,
        recommendation: response.data.recommendation
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderProductCard = (product) => (
    <div key={product.id} className="bg-white rounded-lg shadow-sm p-3 mb-2 hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        <img
          src={product.imageUrl || '/placeholder-product.png'}
          alt={product.name}
          className="w-20 h-20 object-cover rounded"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-gray-800">{product.name}</h4>
          <p className="text-xs text-gray-500">{product.brandName}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-pink-600">
              {product.price?.toLocaleString('vi-VN')}đ
            </span>
            <span className="text-xs text-yellow-600">★ {product.rating}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1 italic">{product.reason}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-t-2xl">
            <h3 className="font-semibold text-lg">Skincare Assistant 💄</h3>
            <p className="text-xs opacity-90">Hỏi tôi về sản phẩm phù hợp với bạn</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <p className="text-sm">Xin chào! 👋</p>
                <p className="text-xs mt-2">Hãy hỏi tôi về sản phẩm skincare phù hợp với bạn</p>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => setInputMessage('Gợi ý sữa rửa mặt cho da dầu')}
                    className="block w-full text-left text-xs bg-white p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    💧 Gợi ý sữa rửa mặt cho da dầu
                  </button>
                  <button
                    onClick={() => setInputMessage('Serum trị mụn hiệu quả')}
                    className="block w-full text-left text-xs bg-white p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    ✨ Serum trị mụn hiệu quả
                  </button>
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${msg.type === 'user' ? 'bg-pink-500 text-white' : 'bg-white text-gray-800'} rounded-2xl p-3 shadow-sm`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  
                  {/* Product Recommendations */}
                  {msg.recommendation?.products && msg.recommendation.products.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.recommendation.products.map(product => renderProductCard(product))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl p-3 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat;
