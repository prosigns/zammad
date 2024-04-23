// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import type {
  UseMutationReturn,
  UseQueryReturn,
  UseQueryOptions,
  UseSubscriptionReturn,
  UseSubscriptionOptions,
  UseMutationOptions,
} from '@vue/apollo-composable'
import type { Ref } from 'vue'
import type { ReactiveFunction } from '#shared/types/utils.ts'
import type { NotificationTypes } from '#shared/components/CommonNotifications/index.ts'
import type { PageInfo } from '#shared/graphql/types.ts'
import type { OperationVariables } from '@apollo/client/core'
import type { GraphQLHandlerError } from '../../error.ts'

export type OperationReturn<TResult, TVariables extends OperationVariables> =
  | UseQueryReturn<TResult, TVariables>
  | UseMutationReturn<TResult, TVariables>
  | UseSubscriptionReturn<TResult, TVariables>

export type OperationQueryOptionsReturn<
  TResult,
  TVariables extends OperationVariables,
> =
  | UseQueryOptions<TResult, TVariables>
  | Ref<UseQueryOptions<TResult, TVariables>>

export type OperationSubscriptionOptionsReturn<
  TResult,
  TVariables extends OperationVariables,
> =
  | UseSubscriptionOptions<TResult, TVariables>
  | Ref<UseSubscriptionOptions<TResult, TVariables>>

export type OperationSubscriptionsResult = {
  __typename?: 'Subscriptions'
  [key: string]: unknown
}

export type OperationQueryResult = {
  __typename?: 'Queries'
  [key: string]: unknown
}

export type OperationMutationResult = {
  __typename?: 'Mutations'
  [key: string]: unknown
}

export type OperationMutationOptions<TResult, TVariables> =
  | UseMutationOptions<TResult, TVariables>
  | ReactiveFunction<UseMutationOptions<TResult, TVariables>>

export type OperationMutationFunction<
  TResult = OperationMutationResult,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TVariables = any,
> = (
  options: OperationMutationOptions<TResult, TVariables>,
) => UseMutationReturn<TResult, TVariables>

export type BaseConnection = {
  __typename?: string
  pageInfo: PageInfo
  nodes?: Maybe<Array<Maybe<unknown>>>
  edges?: Maybe<Array<Maybe<unknown>>>
  totalCount: number
}

export type PaginationVariables = {
  cursor?: Maybe<string>
  pageSize?: Maybe<number>
}

export type OperationResult =
  | OperationQueryResult
  | OperationMutationResult
  | OperationSubscriptionsResult

export interface BaseHandlerOptions {
  errorShowNotification: boolean
  errorNotificationMessage: string
  errorNotificationType: NotificationTypes
  errorCallback?: (error: GraphQLHandlerError) => void | boolean
}

export type CommonHandlerOptions<TOptions> = BaseHandlerOptions & TOptions

export type CommonHandlerOptionsParameter<TOptions> =
  Partial<BaseHandlerOptions> & Partial<TOptions>

export type WatchResultCallback<TResult> = (result: TResult) => void
