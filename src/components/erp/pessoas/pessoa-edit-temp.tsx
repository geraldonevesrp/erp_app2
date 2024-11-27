import { PhotoModal } from "@/components/ui/photo-modal"
// ... outros imports ...

export function PessoaEdit({ pessoaId, isOpen, onClose, onSave }: PessoaEditProps) {
  // ... resto do código ...

  return (
    <>
      <PessoaEditSheet open={isOpen} onOpenChange={handleClose} className="w-full lg:max-w-[1000px]">
        <PessoaEditSheetContent>
          <div className="h-full flex flex-col">
            {/* ... resto do conteúdo ... */}
          </div>
        </PessoaEditSheetContent>
      </PessoaEditSheet>

      {/* Modal da Foto */}
      {pessoa.foto_url && (
        <PhotoModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          photoUrl={pessoa.foto_url}
          alt={`Foto de ${pessoa.nome}`}
        />
      )}
    </>
  )
}
