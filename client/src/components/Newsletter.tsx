import React, { useState } from 'react';
import { Mail, Check, AlertCircle } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Por favor, insira um endereço de email válido');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // Здесь будет API вызов для подписки
      // Пока что симулируем успешную подписку
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('success');
      setMessage('Obrigado pela inscrição! Enviaremos notificações sobre novos artigos.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('Ocorreu um erro. Tente novamente.');
    }
  };

  return (
    <section id="newsletter" className="bg-gradient-to-br from-primary-50 to-blue-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4" style={{letterSpacing: '-0.02em'}}>
            Fique por Dentro
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light" style={{letterSpacing: '-0.01em'}}>
            Inscreva-se na nossa newsletter e receba notificações sobre novos artigos, materiais interessantes e atualizações
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu endereço de email"
                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                style={{letterSpacing: '-0.01em'}}
                disabled={status === 'loading'}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn btn-primary btn-lg px-8 whitespace-nowrap"
            >
              {status === 'loading' ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Inscrevendo-se...</span>
                </div>
              ) : (
                'Inscrever-se'
              )}
            </button>
          </div>

          {/* Status Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-xl flex items-center justify-center space-x-2 ${
              status === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {status === 'success' ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}
        </form>

        <p className="text-sm text-gray-500 mt-6">
          Respeitamos sua privacidade. Você pode cancelar a inscrição a qualquer momento.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
