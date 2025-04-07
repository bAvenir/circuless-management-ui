<template>
  <div class="w-full h-full">
    <RealmPartnershipTable
      v-if="my"
      :partnerships="{
        ingressPartnerships: my.ingressPartnerships,
        egressPartnerships: my.egressPartnerships,
      }"
      :loading="loading"
      @onIngressSelect="(data) => emit('onIngressSelect', data)"
      @onEgressSelect="(data) => emit('onEgressSelect', data)"
      @onIngressDelete="(data) => emit('onIngressDelete', data)"
      @onEgressDelete="(data) => emit('onEgressDelete', data)"
    />
  </div>
</template>

<script lang="ts" setup>
import { organisationTypes } from '~/shared/types'

const props = defineProps<{
  my?: organisationTypes.GetMyRealm | null
  loading: boolean
}>()

const emit = defineEmits(['onIngressSelect', 'onEgressSelect', 'onIngressDelete', 'onEgressDelete'])

const { my } = toRefs(props)
</script>

<style></style>
