import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

const FilterDialog = ({ open, onOpenChange, onApplyFilters }) => {
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedGenero, setSelectedGenero] = useState('');
  const [selectedMarca, setSelectedMarca] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedSubcategoria, setSelectedSubcategoria] = useState('');

  const handleApply = () => {
    onApplyFilters({ selectedTipo, selectedGenero, selectedMarca, selectedCategoria, selectedSubcategoria });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Filtros">
      <div className="p-4">
        <Select value={selectedTipo} onValueChange={setSelectedTipo}>
          <Select.Trigger>
            <Select.Value placeholder="Selecione o Tipo" />
          </Select.Trigger>
          <Select.Content>
            {/* Aqui você deve mapear os tipos de produtos disponíveis */}
            <Select.Item value="tipo1">Tipo 1</Select.Item>
            <Select.Item value="tipo2">Tipo 2</Select.Item>
          </Select.Content>
        </Select>

        <Select value={selectedGenero} onValueChange={setSelectedGenero}>
          <Select.Trigger>
            <Select.Value placeholder="Selecione o Gênero" />
          </Select.Trigger>
          <Select.Content>
            {/* Aqui você deve mapear os gêneros disponíveis */}
            <Select.Item value="genero1">Gênero 1</Select.Item>
            <Select.Item value="genero2">Gênero 2</Select.Item>
          </Select.Content>
        </Select>

        <Select value={selectedMarca} onValueChange={setSelectedMarca}>
          <Select.Trigger>
            <Select.Value placeholder="Selecione a Marca" />
          </Select.Trigger>
          <Select.Content>
            {/* Aqui você deve mapear as marcas disponíveis */}
            <Select.Item value="marca1">Marca 1</Select.Item>
            <Select.Item value="marca2">Marca 2</Select.Item>
          </Select.Content>
        </Select>

        <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
          <Select.Trigger>
            <Select.Value placeholder="Selecione a Categoria" />
          </Select.Trigger>
          <Select.Content>
            {/* Aqui você deve mapear as categorias disponíveis */}
            <Select.Item value="categoria1">Categoria 1</Select.Item>
            <Select.Item value="categoria2">Categoria 2</Select.Item>
          </Select.Content>
        </Select>

        <Select value={selectedSubcategoria} onValueChange={setSelectedSubcategoria}>
          <Select.Trigger>
            <Select.Value placeholder="Selecione a Subcategoria" />
          </Select.Trigger>
          <Select.Content>
            {/* Aqui você deve mapear as subcategorias disponíveis */}
            <Select.Item value="subcategoria1">Subcategoria 1</Select.Item>
            <Select.Item value="subcategoria2">Subcategoria 2</Select.Item>
          </Select.Content>
        </Select>

        <div className="flex justify-end mt-4">
          <Button onClick={handleApply}>Aplicar Filtros</Button>
        </div>
      </div>
    </Dialog>
  );
};

export default FilterDialog;
