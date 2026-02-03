import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight, Sparkles, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    operation: 'all',
    minPrice: '',
    maxPrice: '',
    bedrooms: 'all',
    city: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: () => base44.entities.Property.list('-created_date')
  });

  const featuredProperties = properties.filter(p => p.featured && p.status === 'disponible').slice(0, 3);

  const filteredProperties = properties.filter(p => {
    if (filters.search && !p.title?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !p.city?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.type !== 'all' && p.type !== filters.type) return false;
    if (filters.operation !== 'all' && p.operation !== filters.operation) return false;
    if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
    if (filters.bedrooms !== 'all' && (p.bedrooms || 0) < Number(filters.bedrooms)) return false;
    if (filters.city && !p.city?.toLowerCase().includes(filters.city.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-[#8224e3]/30" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#8224e3] rounded-full blur-[120px]" />
                          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#6b1cb8] rounded-full blur-[150px]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[#8224e3] text-sm font-medium mb-6 backdrop-blur-sm">
                                <Sparkles className="w-4 h-4" />
              Tu próximo hogar te espera
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Encuentra la propiedad<br />
              <span className="text-[#8224e3]">perfecta</span> para ti
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              Explora nuestra exclusiva colección de propiedades. Casas, apartamentos, 
              oficinas y más, en las mejores ubicaciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-14 px-8 bg-[#8224e3] hover:bg-[#6b1cb8] text-white font-semibold text-lg">
                <a href="#propiedades">
                  Explorar Propiedades
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 border-white/30 text-white hover:bg-white/10">
                <Link to={createPageUrl('Admin')}>
                  Administrar
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: properties.length, label: 'Propiedades', icon: Building2 },
              { value: properties.filter(p => p.status === 'disponible').length, label: 'Disponibles', icon: TrendingUp },
              { value: [...new Set(properties.map(p => p.city))].length, label: 'Ciudades', icon: Sparkles },
              { value: '100%', label: 'Confianza', icon: Shield }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#8224e3]/10 text-[#8224e3] mb-3">
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-slate-500 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Propiedades Destacadas</h2>
              <p className="text-slate-500 mt-1">Nuestras mejores opciones para ti</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property, idx) => (
              <PropertyCard key={property.id} property={property} index={idx} />
            ))}
          </div>
        </section>
      )}

      {/* All Properties */}
      <section id="propiedades" className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Todas las Propiedades</h2>
          <p className="text-slate-500">Encuentra tu próxima inversión</p>
        </div>

        <PropertyFilters
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredProperties.map((property, idx) => (
              <PropertyCard key={property.id} property={property} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl mt-8">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No hay propiedades</h3>
            <p className="text-slate-500">Ajusta los filtros o agrega nuevas propiedades</p>
          </div>
        )}
      </section>
    </div>
  );
}