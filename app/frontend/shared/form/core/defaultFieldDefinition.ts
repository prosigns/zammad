// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import type { FormKitTypeDefinition } from '@formkit/core'
import type { FormDefaultProps } from '#shared/types/form.ts'
import hideField from '../features/hideField.ts'
import translateWrapperProps from '../features/translateWrapperProps.ts'
import addBlurEvent from '../features/addBlurEvent.ts'
import formLocaleDir from '../features/formLocaleDir.ts'

const defaultProps: (keyof FormDefaultProps)[] = [
  'formId',
  'labelSrOnly',
  'labelPlaceholder',
  'internal',
]

const defaulfFieldDefinition: Required<
  Pick<FormKitTypeDefinition, 'props' | 'features'>
> = {
  features: [translateWrapperProps, hideField, addBlurEvent, formLocaleDir],
  props: defaultProps,
}

export default defaulfFieldDefinition
