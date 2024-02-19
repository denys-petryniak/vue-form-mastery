<script setup lang="ts">
import { computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { ErrorObject } from '@vuelidate/core'
import type { Category, ModelValue } from '@/types'

interface Props {
  label?: string
  modelValue: ModelValue
  options: Category[]
  errors?: ErrorObject[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: ModelValue): void
}>()

const isError = computed(() => Boolean(props.errors?.length))

const uuid = uuidv4()

function updateModelValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <label v-if="label" :for="uuid" class="label">{{ label }}</label>
  <select
    v-bind="{
      ...$attrs,
      onChange: updateModelValue
    }"
    :id="uuid"
    :value="modelValue"
    class="field"
  >
    <option
      v-for="option in options"
      :key="option"
      :value="option"
      :selected="option === modelValue"
    >
      {{ option }}
    </option>
  </select>
  <template v-if="isError">
    <p
      v-for="error of errors"
      :id="`${uuid}-error`"
      :key="error.$uid"
      aria-live="assertive"
      class="error-message"
    >
      {{ error.$message }}
    </p>
  </template>
</template>
