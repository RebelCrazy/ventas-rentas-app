import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Loader2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PropertyForm from '@/components/PropertyForm';
import StatsCard from '@/components/StatsCard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Plus, Search, MoreVertical, Pencil, Trash2, Eye, 
  Building2, DollarSign, TrendingUp, Home as HomeIcon, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const typeLabels = {
  casa: 'Casa',
  apartamento: 'Apartamento',
  terreno: 'Terreno',
  oficina: 'Oficina',
  local_comercial: 'Local',
  bodega: 'Bodega'
};

const statusColors = {
  disponible: 'bg-emerald-100 text-emerald-800',
  reservada: 'bg-[#8224e3]/10 text-amber-800',
  vendida: 'bg-slate-200 text-slate-700',
  alquilada: 'bg-slate-200 text-slate-700'
};

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [deleteProperty, setDeleteProperty] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  const queryClient = useQueryClient();

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: () => base44.entities.Property.list('-created_date'),
    enabled: isAuthenticated
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Property.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setIsFormOpen(false);
      toast.success('Propiedad creada exitosamente');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Property.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setIsFormOpen(false);
      setEditingProperty(null);
      toast.success('Propiedad actualizada exitosamente');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Property.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setDeleteProperty(null);
      toast.success('Propiedad eliminada exitosamente');
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await base44.auth.isAuthenticated();
        if (authenticated) {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#8224e3] animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#8224e3]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-[#8224e3]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Acceso Restringido</h1>
          <p className="text-slate-500 mb-6">
            Necesitas iniciar sesión para acceder al panel de administración.
          </p>
          <Button 
            onClick={() => base44.auth.redirectToLogin(window.location.href)}
            className="w-full h-12 bg-[#8224e3] hover:bg-[#6b1cb8] text-white font-semibold"
          >
            Iniciar Sesión
          </Button>
          <Button 
            asChild
            variant="ghost" 
            className="w-full mt-3"
          >
            <Link to={createPageUrl('Home')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (data) => {
    if (editingProperty) {
      updateMutation.mutate({ id: editingProperty.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setIsFormOpen(true);
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const filteredProperties = properties.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: properties.length,
    available: properties.filter(p => p.status === 'disponible').length,
    forSale: properties.filter(p => p.operation === 'venta').length,
    totalValue: properties.reduce((acc, p) => acc + (p.price || 0), 0)
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="icon">
                <Link to={createPageUrl('Home')}>
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Administración</h1>
                <p className="text-slate-500">Gestiona tu catálogo de propiedades</p>
              </div>
            </div>
            <Button 
              onClick={() => { setEditingProperty(null); setIsFormOpen(true); }}
              className="bg-slate-900 hover:bg-slate-800 h-11"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Propiedad
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total Propiedades" value={stats.total} icon={Building2} color="slate" index={0} />
          <StatsCard title="Disponibles" value={stats.available} icon={TrendingUp} color="emerald" index={1} />
          <StatsCard title="En Venta" value={stats.forSale} icon={HomeIcon} color="blue" index={2} />
          <StatsCard title="Valor Total" value={formatPrice(stats.totalValue, 'USD')} icon={DollarSign} color="amber" index={3} />
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Buscar propiedades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-white"
          />
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Propiedad</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-900 hidden md:table-cell">Tipo</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-900">Precio</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-900 hidden lg:table-cell">Ciudad</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-900">Estado</th>
                  <th className="text-right py-4 px-6 font-semibold text-slate-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td colSpan={6} className="py-4 px-6">
                          <div className="animate-pulse flex items-center gap-4">
                            <div className="w-16 h-12 bg-slate-200 rounded" />
                            <div className="h-4 bg-slate-200 rounded w-32" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                      <motion.tr
                        key={property.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                              <img
                                src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&q=80'}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900 truncate max-w-[200px]">{property.title}</p>
                              <p className="text-sm text-slate-500">
                                {property.operation === 'venta' ? 'Venta' : 'Alquiler'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          <span className="text-slate-600">{typeLabels[property.type]}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-slate-900">
                            {formatPrice(property.price, property.currency)}
                          </span>
                        </td>
                        <td className="py-4 px-4 hidden lg:table-cell">
                          <span className="text-slate-600">{property.city}</span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={statusColors[property.status]}>
                            {property.status?.charAt(0).toUpperCase() + property.status?.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={createPageUrl('PropertyDetail') + `?id=${property.id}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Ver
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(property)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => setDeleteProperty(property)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-900 font-medium mb-1">No hay propiedades</p>
                        <p className="text-slate-500 text-sm">Agrega tu primera propiedad para comenzar</p>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) setEditingProperty(null); }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingProperty ? 'Editar Propiedad' : 'Nueva Propiedad'}
            </DialogTitle>
          </DialogHeader>
          <PropertyForm
            property={editingProperty}
            onSubmit={handleSubmit}
            onCancel={() => { setIsFormOpen(false); setEditingProperty(null); }}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProperty} onOpenChange={() => setDeleteProperty(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar propiedad?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la propiedad "{deleteProperty?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deleteProperty.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}