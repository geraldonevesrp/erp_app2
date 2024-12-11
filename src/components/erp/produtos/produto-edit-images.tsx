"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Image as ImageIcon, Trash2, Upload, ZoomIn, X } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { usePerfil } from "@/contexts/perfil"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface SortableItemProps {
  id: string
  imagem: any
  onImageDelete: (imagem: any) => void
}

function SortableItem({ id, imagem, onImageDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [zoomImage, setZoomImage] = useState<{ url: string; nome: string } | null>(null)

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="relative group bg-white rounded-lg border shadow-sm overflow-hidden aspect-square max-w-[195px] p-2"
      >
        {/* Container da imagem */}
        <div className="relative h-[85%]">
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
          <img
            src={imagem.url}
            alt={imagem.nome}
            className="w-full h-full object-cover"
          />

          {/* Botões de ação */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setZoomImage({ url: imagem.url, nome: imagem.nome });
              }}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onImageDelete(imagem);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Rodapé com nome da imagem */}
        <div className="h-[15%] px-2 flex items-center justify-center border-t bg-muted/30">
          <p className="text-xs text-center truncate">
            {imagem.nome}
          </p>
        </div>
      </div>

      {/* Dialog de Zoom */}
      <Dialog open={!!zoomImage} onOpenChange={(open) => !open && setZoomImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{zoomImage?.nome}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video">
            {zoomImage && (
              <img
                src={zoomImage.url}
                alt={zoomImage.nome}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface ProdutoEditImagesProps {
  produto: any
  setProduto: (produto: any) => void
  supabase: any
}

export function ProdutoEditImages({
  produto,
  setProduto,
  supabase
}: ProdutoEditImagesProps) {
  const [uploading, setUploading] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<any>(null)
  const { toast } = useToast()
  const { perfil } = usePerfil()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você precisa selecionar uma imagem para fazer upload')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${perfil.id}/produtos_imagens/${produto.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('Perfis')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('Perfis')
        .getPublicUrl(filePath)

      const { error: dbError } = await supabase
        .from('prod_imagens')
        .insert({
          produtos_id: produto.id,
          url: publicUrl,
          nome: file.name,
          size: file.size,
          ordem: (produto.imagens?.length || 0) + 1
        })

      if (dbError) {
        throw dbError
      }

      const { data: imagensData, error: imagensError } = await supabase
        .from("prod_imagens")
        .select()
        .eq("produtos_id", produto.id)
        .order('ordem', { ascending: true });

      if (imagensError) {
        throw imagensError;
      }

      setProduto(prev => ({ ...prev, imagens: imagensData }))

      toast({
        title: "Sucesso",
        description: "Imagem adicionada com sucesso",
      })

    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error)
      toast({
        title: "Erro ao fazer upload",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async (imagem: any) => {
    try {
      const filePath = imagem.url.split('/files/')[1]
      const { error: storageError } = await supabase.storage
        .from('files')
        .remove([filePath])

      if (storageError) {
        throw storageError
      }

      const { error: dbError } = await supabase
        .from('prod_imagens')
        .delete()
        .eq('id', imagem.id)

      if (dbError) {
        throw dbError
      }

      setProduto(prev => ({
        ...prev,
        imagens: prev.imagens.filter((img: any) => img.id !== imagem.id)
      }))

      toast({
        title: "Sucesso",
        description: "Imagem removida com sucesso",
      })

    } catch (error) {
      console.error('Erro ao remover imagem:', error)
      toast({
        title: "Erro ao remover",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setImageToDelete(null)
    }
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      try {
        const oldIndex = produto.imagens.findIndex((item: any) => item.id.toString() === active.id);
        const newIndex = produto.imagens.findIndex((item: any) => item.id.toString() === over.id);
        
        const newItems = arrayMove(produto.imagens, oldIndex, newIndex);
        
        const updates = newItems.map((item: any, index: number) => ({
          id: item.id,
          ordem: index + 1
        }));

        for (const update of updates) {
          const { error } = await supabase
            .from('prod_imagens')
            .update({ ordem: update.ordem })
            .eq('id', update.id);

          if (error) throw error;
        }

        toast({
          title: "Sucesso",
          description: "Ordem das imagens atualizada",
        });
      } catch (error) {
        console.error('Erro ao atualizar ordem:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar ordem das imagens",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Imagens do Produto</Label>
        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <Button
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            {uploading ? 'Enviando...' : 'Upload'}
            <Upload className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <SortableContext
            items={produto?.imagens?.map((img: any) => img.id.toString()) || []}
            strategy={rectSortingStrategy}
          >
            {produto?.imagens?.map((imagem: any) => (
              <SortableItem
                key={imagem.id}
                id={imagem.id.toString()}
                imagem={imagem}
                onImageDelete={setImageToDelete}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      {produto?.imagens?.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-2 text-sm font-semibold text-muted-foreground">Nenhuma imagem</h3>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Arraste uma imagem ou clique em upload para adicionar
          </p>
        </div>
      )}

      <AlertDialog 
        open={!!imageToDelete}
        onOpenChange={() => setImageToDelete(null)}
      >
        <AlertDialogContent className="border-destructive">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Excluir Imagem</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta imagem? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => imageToDelete && handleRemoveImage(imageToDelete)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
