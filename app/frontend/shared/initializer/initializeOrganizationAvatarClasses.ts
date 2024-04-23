// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import type { OrganizationAvatarClassMap } from '#shared/components/CommonOrganizationAvatar/types.ts'

// Provide your own map with the following keys, the values given here are just examples.
let organizationAvatarClasses: OrganizationAvatarClassMap = {
  backgroundColor: 'common-organization-avatar-background-color',
}

export const initializeOrganizationAvatarClasses = (
  classes: OrganizationAvatarClassMap,
) => {
  organizationAvatarClasses = classes
}

export const getOrganizationAvatarClasses = () => organizationAvatarClasses
