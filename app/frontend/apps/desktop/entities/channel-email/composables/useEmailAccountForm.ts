// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import type { ShallowRef } from 'vue'
import { shallowRef } from 'vue'

import type { FormRef } from '#shared/components/Form/types.ts'
import { useForm } from '#shared/components/Form/useForm.ts'

import type { EmailAccountData } from '../types/email-account.ts'

export const useEmailAccountForm = () => {
  const formEmailAccount: ShallowRef<FormRef | undefined> = shallowRef()

  const emailAccountSchema = [
    {
      isLayout: true,
      element: 'div',
      attrs: {
        class: 'grid grid-cols-1 gap-y-2.5 gap-x-3',
      },
      children: [
        {
          name: 'realname',
          label: __('Full Name'),
          type: 'text',
          props: {
            placeholder: __('Organization Support'),
          },
          required: true,
        },
        {
          name: 'email',
          label: __('Email Address'),
          type: 'email',
          props: {},
          validation: 'email',
          required: true,
        },
        {
          name: 'password',
          label: __('Password'),
          type: 'password',
          props: {},
          required: true,
        },
      ],
    },
  ]

  const { values, formSetErrors, updateFieldValues } =
    useForm<EmailAccountData>(formEmailAccount)

  return {
    formEmailAccount,
    emailAccountSchema,
    formEmailAccountValues: values,
    updateEmailAccountFieldValues: updateFieldValues,
    formEmailAccountSetErrors: formSetErrors,
  }
}
