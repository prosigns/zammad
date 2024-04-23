// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import type { Primitive } from 'type-fest'
import type {
  FormFieldValue,
  FormValues,
} from '#shared/components/Form/types.ts'
import type {
  ObjectAttributeValueInput,
  ObjectManagerFrontendAttribute,
} from '#shared/graphql/types.ts'
import { convertToGraphQLId, isGraphQLId } from '#shared/graphql/utils.ts'
import { camelize, toClassName } from '#shared/utils/formatter.ts'

export const useObjectAttributeFormData = (
  objectAttributes: Map<string, ObjectManagerFrontendAttribute>,
  values: FormValues,
) => {
  const internalObjectAttributeValues: Record<string, FormFieldValue> = {}
  const additionalObjectAttributeValues: ObjectAttributeValueInput[] = []

  const fullRelationId = (relation: string, value: number | string) => {
    return convertToGraphQLId(toClassName(relation), value)
  }

  const ensureRelationId = (
    attribute: ObjectManagerFrontendAttribute,
    value: FormFieldValue,
  ) => {
    const { relation } = attribute.dataOption
    const isInternalID =
      typeof value === 'number' ||
      (typeof value === 'string' && !isGraphQLId(value))

    if (relation && isInternalID) {
      return fullRelationId(relation, value)
    }
    return value
  }

  Object.keys(values).forEach((fieldName) => {
    const objectAttribute = objectAttributes.get(fieldName)
    const value = values[fieldName]

    if (!objectAttribute || value === undefined) return

    if (objectAttribute.isInternal) {
      const name = camelize(fieldName)

      let newValue: FormFieldValue
      if (Array.isArray(value)) {
        newValue = value.map((elem) => {
          return ensureRelationId(objectAttribute, elem) as Primitive
        })
      } else {
        newValue = ensureRelationId(objectAttribute, value)
      }

      internalObjectAttributeValues[name] = newValue
    } else {
      additionalObjectAttributeValues.push({
        name: objectAttribute.name,
        value,
      })
    }
  })

  return {
    internalObjectAttributeValues,
    additionalObjectAttributeValues,
  }
}
