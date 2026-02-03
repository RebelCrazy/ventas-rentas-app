import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const defaultProperty = {
  title: '',
  description: '',
  type: 'casa',
  operation: 'venta',
  price: '',
  currency: 'USD',
  area: '',
  bedrooms: '',
  bathrooms: '',
  parking: '',
  address: '',
  city: '',
  neighborhood: '',
  images: [],
  features: [],
  status: 'disponible',
  featured: false
};

export default function PropertyForm({ property, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState(property || defaultProperty);
  const [newFeature, setNewFeature] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    const uploadedUrls = [];

    for (const file of files) {
      const result = await base44.integrations.Core.UploadFile({ file });
      if (result.file_url) {
        uploadedUrls.push(result.file_url);
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...uploadedUrls]
    }));
    setUploadingImages(false);
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      price: Number(formData.price),
      area: Number(formData.area) || 0,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      parking: Number(formData.parking) || 0
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Información básica */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b">Información Básica</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label>Título *</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ej: Hermosa casa con jardín en zona residencial"
              className="mt-2 h-12"
              required
            />
          </div>

          <div>
            <Label>Tipo de propiedad *</Label>
            <Select value={formData.type} onValueChange={(v) => handleChange('type', v)}>
              <SelectTrigger className="mt-2 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
            <Label>Operación *</Label>
            <Select value={formData.operation} onValueChange={(v) => handleChange('operation', v)}>
              <SelectTrigger className="mt-2 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="venta">Venta</SelectItem>
                <SelectItem value="alquiler">Alquiler</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Precio *</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="0"
              className="mt-2 h-12"
              required
            />
          </div>

          <div>
            <Label>Moneda</Label>
            <Select value={formData.currency} onValueChange={(v) => handleChange('currency', v)}>
              <SelectTrigger className="mt-2 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="MXN">MXN ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Estado</Label>
            <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
              <SelectTrigger className="mt-2 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="reservada">Reservada</SelectItem>
                <SelectItem value="vendida">Vendida</SelectItem>
                <SelectItem value="alquilada">Alquilada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <Switch
              checked={formData.featured}
              onCheckedChange={(v) => handleChange('featured', v)}
            />
            <Label className="cursor-pointer">Marcar como destacada</Label>
          </div>
        </div>

        <div>
          <Label>Descripción</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe la propiedad en detalle..."
            className="mt-2 min-h-[120px]"
          />
        </div>
      </div>

      {/* Características */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b">Características</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <Label>Área (m²)</Label>
            <Input
              type="number"
              value={formData.area}
              onChange={(e) => handleChange('area', e.target.value)}
              placeholder="0"
              className="mt-2 h-12"
            />
          </div>
          <div>
            <Label>Habitaciones</Label>
            <Input
              type="number"
              value={formData.bedrooms}
              onChange={(e) => handleChange('bedrooms', e.target.value)}
              placeholder="0"
              className="mt-2 h-12"
            />
          </div>
          <div>
            <Label>Baños</Label>
            <Input
              type="number"
              value={formData.bathrooms}
              onChange={(e) => handleChange('bathrooms', e.target.value)}
              placeholder="0"
              className="mt-2 h-12"
            />
          </div>
          <div>
            <Label>Estacionamientos</Label>
            <Input
              type="number"
              value={formData.parking}
              onChange={(e) => handleChange('parking', e.target.value)}
              placeholder="0"
              className="mt-2 h-12"
            />
          </div>
        </div>

        <div>
          <Label>Características adicionales</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Ej: Piscina, Jardín, Gimnasio..."
              className="h-12"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
            />
            <Button type="button" onClick={handleAddFeature} variant="outline" className="h-12 px-4">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          {formData.features?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.features.map((feature, idx) => (
                <Badge key={idx} variant="secondary" className="px-3 py-1.5 text-sm">
                  {feature}
                  <button type="button" onClick={() => handleRemoveFeature(idx)} className="ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ubicación */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b">Ubicación</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label>Ciudad *</Label>
            <Input
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Ej: Ciudad de México"
              className="mt-2 h-12"
              required
            />
          </div>
          <div>
            <Label>Colonia / Barrio</Label>
            <Input
              value={formData.neighborhood}
              onChange={(e) => handleChange('neighborhood', e.target.value)}
              placeholder="Ej: Polanco"
              className="mt-2 h-12"
            />
          </div>
          <div>
            <Label>Dirección</Label>
            <Input
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Calle y número"
              className="mt-2 h-12"
            />
          </div>
        </div>
      </div>

      {/* Imágenes */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b">Imágenes</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formData.images?.map((img, idx) => (
            <div key={idx} className="relative aspect-video rounded-lg overflow-hidden group">
              <img src={img} alt={`Imagen ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <label className="aspect-video rounded-lg border-2 border-dashed border-slate-300 hover:border-amber-500 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-amber-600">
            {uploadingImages ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <>
                <Upload className="w-8 h-8" />
                <span className="text-sm">Subir imagen</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploadingImages}
            />
          </label>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="h-12 px-6">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="h-12 px-8 bg-slate-900 hover:bg-slate-800">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            property ? 'Actualizar Propiedad' : 'Crear Propiedad'
          )}
        </Button>
      </div>
    </form>
  );
}