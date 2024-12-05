import { isEqual } from 'lodash'

interface EntityBase {
  id?: number
  _isNew?: boolean
  _isDeleted?: boolean
  _tempId?: number
}

export function useEntityArrayState<T extends EntityBase>(
  entities: T[],
  originalEntities: T[],
  equalityFields: (keyof T)[]
) {
  const hasChanges = () => {
    // Verifica se há itens novos (sem ID) ou deletados
    const hasNewOrDeleted = entities.some(entity => 
      (entity._isNew && !entity.id) || // Só considera novo se não tiver ID
      entity._isDeleted
    )
    if (hasNewOrDeleted) return true

    // Verifica mudanças em itens existentes
    const existingChanges = entities.some(entity => {
      if (!entity.id) return false
      const original = originalEntities.find(orig => orig.id === entity.id)
      if (!original) return true

      // Compara apenas os campos especificados
      const entityFields = equalityFields.reduce((acc, field) => {
        acc[field] = entity[field]
        return acc
      }, {} as Partial<T>)

      const originalFields = equalityFields.reduce((acc, field) => {
        acc[field] = original[field]
        return acc
      }, {} as Partial<T>)

      return !isEqual(entityFields, originalFields)
    })

    return existingChanges
  }

  const compareArrays = () => {
    const added = entities.filter(e => e._isNew && !e.id && !e._isDeleted) // Só considera novo se não tiver ID
    const deleted = entities.filter(e => e._isDeleted)
    const modified = entities.filter(e => {
      if ((e._isNew && !e.id) || e._isDeleted) return false // Só considera novo se não tiver ID
      if (!e.id) return false
      const original = originalEntities.find(orig => orig.id === e.id)
      if (!original) return false

      const entityFields = equalityFields.reduce((acc, field) => {
        acc[field] = e[field]
        return acc
      }, {} as Partial<T>)

      const originalFields = equalityFields.reduce((acc, field) => {
        acc[field] = original[field]
        return acc
      }, {} as Partial<T>)

      return !isEqual(entityFields, originalFields)
    })

    return {
      added,
      deleted,
      modified,
      hasChanges: added.length > 0 || deleted.length > 0 || modified.length > 0
    }
  }

  return {
    hasChanges,
    compareArrays
  }
}
