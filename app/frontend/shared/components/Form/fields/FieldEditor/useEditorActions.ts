// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import { i18n } from '#shared/i18n.ts'
import type { ChainedCommands } from '@tiptap/core'
import type { Editor } from '@tiptap/vue-3'
import { computed, nextTick, onUnmounted } from 'vue'
import type { ShallowRef } from 'vue'

import testFlags from '#shared/utils/testFlags.ts'
import { PLUGIN_NAME as KnowledgeBaseMentionName } from './suggestions/KnowledgeBaseSuggestion.ts'
import { PLUGIN_NAME as TextModuleMentionName } from './suggestions/TextModuleSuggestion.ts'
import { PLUGIN_NAME as UserMentionName } from './suggestions/UserMention.ts'
import type { EditorContentType } from './types.ts'
import { convertInlineImages } from './utils.ts'

export interface EditorButton {
  name: string
  class?: string
  icon: string
  label?: string
  contentType: EditorContentType[]
  attributes?: Record<string, unknown>
  command?: () => void
}

export default function useEditorActions(
  editor: ShallowRef<Editor | undefined>,
  contentType: EditorContentType,
  disabledPlugins: string[],
) {
  const focused = (
    fn: (commands: ChainedCommands) => ChainedCommands | null | void,
  ) => {
    return () => {
      if (!editor.value) return
      const chain = editor.value.chain().focus()
      fn(chain)?.run()
    }
  }

  const isActive = (type: string, attributes?: Record<string, unknown>) => {
    return editor.value?.isActive(type, attributes) ?? false
  }

  // this is primarily used by cypress tests, where it requires an actual input in the DOM tree
  let fileInput: HTMLInputElement | null = null

  const getInputForImage = () => {
    if (fileInput) return fileInput

    fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.multiple = true
    fileInput.accept = 'image/*'
    fileInput.style.display = 'none'
    if (import.meta.env.DEV || VITE_TEST_MODE) {
      fileInput.dataset.testId = 'editor-image-input'
    }
    document.body.appendChild(fileInput)

    return fileInput
  }

  onUnmounted(() => {
    fileInput?.remove()
    fileInput = null
  })

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const getActionsList = (): EditorButton[] => {
    return [
      {
        name: 'underline',
        contentType: ['text/html'],
        label: i18n.t('Format as underlined'),
        icon: 'text-style-underline',
        command: focused((c) => c.toggleUnderline()),
      },
      {
        name: 'bold',
        contentType: ['text/html'],
        label: i18n.t('Format as bold'),
        icon: 'text-style-bold',
        command: focused((c) => c.toggleBold()),
      },
      {
        name: 'italic',
        contentType: ['text/html'],
        label: i18n.t('Format as italic'),
        icon: 'text-style-italic',
        command: focused((c) => c.toggleItalic()),
      },
      {
        name: 'strike',
        contentType: ['text/html'],
        label: i18n.t('Format as strikethrough'),
        icon: 'text-style-strikethrough',
        command: focused((c) => c.toggleStrike()),
      },
      {
        name: 'image',
        contentType: ['text/html'],
        label: i18n.t('Add image'),
        icon: 'editor-inline-image',
        command: focused((c) => {
          const input = getInputForImage()
          input.onchange = async () => {
            if (!input.files?.length || !editor.value) return
            const files = await convertInlineImages(
              input.files,
              editor.value.view.dom,
            )
            c.setImages(files).run()
            input.value = ''
            nextTick(() => testFlags.set('editor.inlineImagesAdded'))
          }
          if (!VITE_TEST_MODE) input.click()
        }),
      },
      {
        name: 'link',
        contentType: ['text/html'],
        label: i18n.t('Add link'),
        icon: 'editor-inline-link',
        command: focused((c) => {
          if (!editor.value) return null
          // eslint-disable-next-line no-alert
          const href = prompt(i18n.t('Enter link URL'))
          if (!href) return null
          const { view, state } = editor.value
          const { from, to } = view.state.selection
          const text = state.doc.textBetween(from, to, '')

          if (text) {
            return c.toggleLink({ href })
          }

          return c.insertContent({
            type: 'text',
            text: href,
            marks: [
              {
                type: 'link',
                attrs: {
                  href,
                },
              },
            ],
          })
        }),
      },
      {
        name: 'heading',
        contentType: ['text/html'],
        label: i18n.t('Add first level heading'),
        icon: 'text-style-h1',
        attributes: {
          level: 1,
        },
        command: focused((c) => c.toggleHeading({ level: 1 })),
      },
      {
        name: 'heading',
        contentType: ['text/html'],
        label: i18n.t('Add second level heading'),
        icon: 'text-style-h2',
        attributes: {
          level: 2,
        },
        command: focused((c) => c.toggleHeading({ level: 2 })),
      },
      {
        name: 'heading',
        contentType: ['text/html'],
        label: i18n.t('Add third level heading'),
        icon: 'text-style-h3',
        attributes: {
          level: 3,
        },
        command: focused((c) => c.toggleHeading({ level: 3 })),
      },
      {
        name: 'orderedList',
        contentType: ['text/html'],
        label: i18n.t('Add ordered list'),
        icon: 'editor-ordered-list',
        command: focused((c) => {
          if (isActive('orderedList')) {
            return c.liftListItem('listItem')
          }
          return c.toggleOrderedList()
        }),
      },
      {
        name: 'bulletList',
        contentType: ['text/html'],
        label: i18n.t('Add bullet list'),
        icon: 'editor-bullet-list',
        command: focused((c) => {
          if (isActive('orderedList')) {
            return c.liftListItem('listItem')
          }
          return c.toggleBulletList()
        }),
      },
      {
        name: 'jibberish',
        contentType: ['text/html'],
        label: i18n.t('Remove formatting'),
        icon: 'editor-remove-formatting',
        command: focused((c) => c.clearNodes().unsetAllMarks()),
      },
      {
        name: UserMentionName,
        contentType: ['text/html'],
        label: i18n.t('Mention user'),
        icon: 'editor-mention-user',
        command: focused((c) => c.openUserMention()),
      },
      {
        name: KnowledgeBaseMentionName,
        contentType: ['text/html', 'text/plain'],
        label: i18n.t('Insert text from Knowledge Base article'),
        icon: 'editor-mention-knowledge-base',
        command: focused((c) => c.openKnowledgeBaseMention()),
      },
      {
        name: TextModuleMentionName,
        contentType: ['text/html', 'text/plain'],
        label: i18n.t('Insert text from text module'),
        icon: 'editor-mention-text-module',
        command: focused((c) => c.openTextMention()),
      },
    ]
  }

  const actions = computed(() => {
    return getActionsList().filter((action) => {
      if (disabledPlugins.includes(action.name)) {
        return false
      }
      return action.contentType.includes(contentType)
    })
  })

  return {
    focused,
    isActive,
    actions,
  }
}
