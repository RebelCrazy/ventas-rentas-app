import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ImageGallery from '@/components/ImageGallery';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, MapPin, Bed, Bath, Car, Maximize, 
  CheckCircle, Share2, Heart, Phone, Mail, Building2
} from 'lucide-react';
import { motion } from 'framer-motion';

const typeLabels = {
  casa: 'Casa',
  apartamento: 'Apartamento',
  terreno: 'Terreno',
  oficina: 'Oficina',
  local_comercial: 'Local Comercial',
  bodega: 'Bodega'
};

const statusLabels = {
  disponible: { text: 'Disponible', color: 'bg-emerald-500' },
  reservada: { text: 'Reservada', color: 'bg-amber-500' },
  vendida: { text: 'Vendida', color: 'bg-slate-500' },
  alquilada: { text: 'Alquilada', color: 'bg-slate-500' }
};

export default function PropertyDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get('id');

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const properties = await base44.entities.Property.filter({ id: propertyId });
      return properties[0];
    },
    enabled: !!propertyId
  });

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Building2 className="w-16 h-16 text-slate-300 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Propiedad no encontrada</h1>
        <p className="text-slate-500 mb-6">La propiedad que buscas no existe o fue eliminada</p>
        <Button asChild>
          <Link to={createPageUrl('Home')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button asChild variant="ghost" className="gap-2">
            <Link to={createPageUrl('Home')}>
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ImageGallery images={property.images} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-[#8224e3]/10 text-[#8224e3] font-medium">
                  {property.operation === 'venta' ? 'En Venta' : 'En Alquiler'}
                </Badge>
                <Badge className={`${statusLabels[property.status]?.color} text-white font-medium`}>
                  {statusLabels[property.status]?.text}
                </Badge>
                <Badge variant="outline" className="font-medium">
                  {typeLabels[property.type]}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                {property.title}
              </h1>

              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-5 h-5 text-[#8224e3]" />
                <span>{property.address && `${property.address}, `}{property.neighborhood && `${property.neighborhood}, `}{property.city}</span>
              </div>
            </motion.div>

            {/* Specs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Características</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {property.area > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-slate-100 rounded-xl">
                          <Maximize className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-slate-900">{property.area}</p>
                          <p className="text-sm text-slate-500">m² totales</p>
                        </div>
                      </div>
                    )}
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-slate-100 rounded-xl">
                          <Bed className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-slate-900">{property.bedrooms}</p>
                          <p className="text-sm text-slate-500">Habitaciones</p>
                        </div>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-slate-100 rounded-xl">
                          <Bath className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-slate-900">{property.bathrooms}</p>
                          <p className="text-sm text-slate-500">Baños</p>
                        </div>
                      </div>
                    )}
                    {property.parking > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-slate-100 rounded-xl">
                          <Car className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-slate-900">{property.parking}</p>
                          <p className="text-sm text-slate-500">Estacionamiento</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Description */}
            {property.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Descripción</h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {property.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Features */}
            {property.features?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Amenidades</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-600">
                          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <p className="text-slate-500 text-sm mb-1">Precio</p>
                    <p className="text-4xl font-bold text-slate-900">
                      {formatPrice(property.price, property.currency)}
                    </p>
                    {property.operation === 'alquiler' && (
                      <p className="text-slate-500">por mes</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full h-12 bg-[#8224e3] hover:bg-[#6b1cb8] text-white font-semibold">
                      <Phone className="w-4 h-4 mr-2" />
                      Contactar ahora
                    </Button>
                    <Button variant="outline" className="w-full h-12">
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar mensaje
                    </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-sm text-slate-500 text-center">
                      Publicado el {new Date(property.created_date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}