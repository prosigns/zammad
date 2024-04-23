// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import type { Ref } from 'vue'
import type { UseMutationReturn } from '@vue/apollo-composable'
import type { OperationVariables } from '@apollo/client/core'
import UserError from '#shared/errors/UserError.ts'
import type { OperationMutationResult } from '#shared/types/server/apollo/handler.ts'
import type { UserErrors } from '#shared/types/error.ts'
import BaseHandler from './BaseHandler.ts'

export default class MutationHandler<
  TResult = OperationMutationResult,
  TVariables extends OperationVariables = OperationVariables,
> extends BaseHandler<
  TResult,
  TVariables,
  UseMutationReturn<TResult, TVariables>
> {
  public async send(variables?: TVariables): Promise<Maybe<TResult>> {
    return new Promise((resolve, reject) => {
      this.operationResult.mutate(variables).then((result) => {
        if (!result) {
          return reject(this.operationError().value)
        }

        if (result.data) {
          const { errors } = Object.values(result.data)[0] as {
            errors: UserErrors
          }

          if (errors) {
            const userErrors = new UserError(errors)

            return reject(userErrors)
          }
        }

        return resolve(result.data || null)
      })
    })
  }

  public called(): Ref<boolean> {
    return this.operationResult.called
  }
}
