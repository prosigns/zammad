<!-- Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/ -->

<script setup lang="ts">
import LayoutContent from '#desktop/components/layout/LayoutContent.vue'

import { useBreadcrumb } from '../composables/useBreadcrumb.ts'

const { breadcrumbItems } = useBreadcrumb(__('Devices'))
</script>

<template>
  <LayoutContent provide-default :breadcrumb-items="breadcrumbItems">
    <div class="mb-4 max-w-[600px]">
      <CommonLabel>{{ 'Coming soon…' }}</CommonLabel>
    </div>
  </LayoutContent>
</template>
