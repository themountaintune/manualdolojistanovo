import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-medium text-gray-900" style={{letterSpacing: '-0.02em'}}>ManualDolojista</span>
            </Link>
            <p className="text-gray-600 mb-6 max-w-md font-light" style={{letterSpacing: '-0.01em'}}>
              O guia definitivo para empreendedores online e donos de lojas virtuais no Brasil. 
              Aprenda, cresça e transforme seu negócio digital.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900" style={{letterSpacing: '-0.02em'}}>Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors font-light"
                  style={{letterSpacing: '-0.01em'}}
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors font-light"
                  style={{letterSpacing: '-0.01em'}}
                >
                  Artigos
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors font-light"
                  style={{letterSpacing: '-0.01em'}}
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors font-light"
                  style={{letterSpacing: '-0.01em'}}
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/?category=ecommerce"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  E-commerce
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=marketing"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Marketing Digital
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=vendas"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Vendas Online
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=negocios"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Negócios
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 ManualDolojista. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Política de Privacidade
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
