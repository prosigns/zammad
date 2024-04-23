// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import type { StoredFile } from '#shared/graphql/types.ts'
import type { InputHTMLAttributes } from 'vue'

export interface FieldFileProps {
  accept?: InputHTMLAttributes['accept']
  capture?: InputHTMLAttributes['capture']
  multiple?: InputHTMLAttributes['multiple']
}

export type FileUploaded = Pick<StoredFile, 'name' | 'size' | 'type'> & {
  id?: Maybe<string>
  content?: string
  preview?: string
  isProcessing?: boolean
}

export interface FieldFileContext {
  uploadFiles(files: FileList | File[]): Promise<void>
}
