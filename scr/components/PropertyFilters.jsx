import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PropertyFilters({ filters, setFilters, showFilters, setShowFilters }) {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      operation: 'all',
      minPrice: '',
      maxPrice: '',
      bedrooms: 'all',
      city: ''
    });
  };

  const hasActiveFilters = filters.type !== 'all' || filters.operation !== 'all' || 
    filters.minPrice || filters.maxPrice || filters.bedrooms !== 'all' || filters.city;

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Buscar propiedades..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="pl-12 h-12 bg-white border-slate-200 rounded-xl text-base"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className={`h-12 px-5 rounded-xl ${showFilters ? 'bg-slate-900' : ''}`}
        >
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          Filtros
          {hasActiveFilters && (
            <span className="ml-2 w-2 h-2 rounded-full bg-amber-500" />
          )}
        </Button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Tipo</label>
                  <Select value={filters.type} onValueChange={(v) => handleChange('type', v)}>
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="apartamento">Apartamento</SelectItem>
                      <SelectItem value="terreno">Terreno</SelectItem>
                      <SelectItem value="oficina">Oficina</SelectItem>
                      <SelectItem value="local_comercial">Local Comercial</SelectItem>
                      <SelectItem value="bodega">Bodega</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Operación</label>
                  <Select value={filters.operation} onValueChange={(v) => handleChange('operation', v)}>
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="venta">Venta</SelectItem>
                      <SelectItem value="alquiler">Alquiler</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Precio Mín.</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => handleChange('minPrice', e.target.value)}
                    className="h-11 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Precio Máx.</label>
                  <Input
                    type="number"
                    placeholder="Sin límite"
                    value={filters.maxPrice}
                    onChange={(e) => handleChange('maxPrice', e.target.value)}
                    className="h-11 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Habitaciones</label>
                  <Select value={filters.bedrooms} onValueChange={(v) => handleChange('bedrooms', v)}>
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Ciudad</label>
                  <Input
                    placeholder="Cualquier ciudad"
                    value={filters.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="h-11 rounded-lg"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                  <Button variant="ghost" onClick={clearFilters} className="text-slate-600">
                    <X className="w-4 h-4 mr-2" />
                    Limpiar filtros
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}