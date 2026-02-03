import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Car, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';

const typeLabels = {
  casa: 'Casa',
  apartamento: 'Apartamento',
  terreno: 'Terreno',
  oficina: 'Oficina',
  local_comercial: 'Local Comercial',
  bodega: 'Bodega'
};

const statusColors = {
  disponible: 'bg-emerald-500',
  reservada: 'bg-[#8224e3]',
  vendida: 'bg-slate-500',
  alquilada: 'bg-slate-500'
};

export default function PropertyCard({ property, index = 0 }) {
  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const mainImage = property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={createPageUrl('PropertyDetail') + `?id=${property.id}`}>
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={mainImage}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-white/95 text-slate-800 font-medium backdrop-blur-sm">
                {property.operation === 'venta' ? 'Venta' : 'Alquiler'}
              </Badge>
              <Badge className={`${statusColors[property.status]} text-white font-medium`}>
                {property.status?.charAt(0).toUpperCase() + property.status?.slice(1)}
              </Badge>
            </div>

            {property.featured && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-[#8224e3] text-white font-medium">
                  Destacada
                </Badge>
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white/80 text-sm font-medium">
                {typeLabels[property.type]}
              </p>
              <p className="text-white text-2xl font-bold">
                {formatPrice(property.price, property.currency)}
                {property.operation === 'alquiler' && <span className="text-base font-normal">/mes</span>}
              </p>
            </div>
          </div>

          <div className="p-5">
            <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-1 group-hover:text-[#8224e3] transition-colors">
              {property.title}
            </h3>
            
            <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-4">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{property.neighborhood}, {property.city}</span>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Bed className="w-4 h-4" />
                  <span className="text-sm">{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Bath className="w-4 h-4" />
                  <span className="text-sm">{property.bathrooms}</span>
                </div>
              )}
              {property.parking > 0 && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Car className="w-4 h-4" />
                  <span className="text-sm">{property.parking}</span>
                </div>
              )}
              {property.area > 0 && (
                <div className="flex items-center gap-1.5 text-slate-600 ml-auto">
                  <Maximize className="w-4 h-4" />
                  <span className="text-sm">{property.area} m²</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}