import { useToast } from "@/components/ui/use-toast"
import { Dispatch, SetStateAction } from "react"

interface EntityBase {
  id?: number
  _isNew?: boolean
  _isDeleted?: boolean
  _tempId?: number
}

interface UseEntityOperationsProps<T extends EntityBase> {
  pessoa: {
    id: number
    [key: string]: any
  }
  items: T[]
  setItems: Dispatch<SetStateAction<T[]>>
  itemsKey: string
  onPessoaChange: (pessoa: any) => void
  getItemDescription?: (item: T) => string
}

export function useEntityOperations<T extends EntityBase>({
  pessoa,
  items,
  setItems,
  itemsKey,
  onPessoaChange,
  getItemDescription = () => 'Item'
}: UseEntityOperationsProps<T>) {
  const { toast } = useToast()

  const handleItemChange = (index: number, field: keyof T, value: any) => {
    const updatedItems = [...items]
    const item = { ...updatedItems[index] }
    
    item[field] = value
    updatedItems[index] = item

    setItems(updatedItems)
    
    onPessoaChange({
      ...pessoa,
      [itemsKey]: updatedItems
    })
  }

  const handleItemAdd = (newItem: T) => {
    const updatedItems = [...items, newItem]
    setItems(updatedItems)
    
    onPessoaChange({
      ...pessoa,
      [itemsKey]: updatedItems
    })
  }

  const handleItemRemove = (index: number) => {
    const updatedItems = [...items]
    const item = updatedItems[index]

    if (item.id) {
      item._isDeleted = true
      setItems(updatedItems)
      
      onPessoaChange({
        ...pessoa,
        [itemsKey]: updatedItems
      })
      
      toast({
        description: `${getItemDescription(item)} removido com sucesso`
      })
    } else {
      updatedItems.splice(index, 1)
      setItems(updatedItems)
      
      onPessoaChange({
        ...pessoa,
        [itemsKey]: updatedItems
      })
    }
  }

  return {
    handleItemChange,
    handleItemAdd,
    handleItemRemove
  }
}
