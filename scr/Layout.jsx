import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Building2 } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        :root {
          --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
        }
        body {
          font-family: var(--font-sans);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
      
      {children}

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link to={createPageUrl('Home')} className="flex items-center gap-2 mb-4">
                                    <img 
                                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c1aa128de49a46c8d4976/6c0994bd0_cropped-cropped-LogoMakerCa-1676987135719-e1718827649495.png" 
                                      alt="Ventas Rentas Etc" 
                                      className="h-12 w-auto"
                                    />
                                  </Link>
              <p className="text-slate-400 max-w-sm">
                Tu socio de confianza para encontrar la propiedad perfecta. 
                Casas, apartamentos, oficinas y más.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link to={createPageUrl('Home')} className="hover:text-white transition-colors">Inicio</Link></li>
                <li><Link to={createPageUrl('Admin')} className="hover:text-white transition-colors">Administración</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-slate-400">
                <li>info@inmobiliaria.com</li>
                <li>+52 55 1234 5678</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} Inmobiliaria. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}