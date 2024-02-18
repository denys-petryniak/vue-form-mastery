<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { helpers, maxLength, minLength, required } from '@vuelidate/validators'
import type { Categories, Event, RadioOption } from '@/types'

import BaseButton from '@/components/base/BaseButton.vue'
import BaseCheckbox from '@/components/base/BaseCheckbox.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseRadioGroup from '@/components/base/BaseRadioGroup.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'

const categories = ref<Categories[]>([
  'sustainability',
  'nature',
  'animal welfare',
  'housing',
  'education',
  'food',
  'community'
])

const getInitialFormData = (): Event => ({
  category: '',
  title: '',
  description: '',
  location: '',
  pets: 1,
  extras: {
    catering: false,
    music: false
  }
})

const event: Event = reactive(getInitialFormData())

const titleFieldMinLength = ref(4)
const descriptionFieldMinLength = ref(20)
const descriptionFieldMaxLength = ref(100)

const validationRules = computed(() => ({
  category: { required: helpers.withMessage('Category is required', required) },
  title: {
    required: helpers.withMessage('Title is required', required),
    minLength: minLength(titleFieldMinLength)
  },
  description: {
    required: helpers.withMessage('Description is required', required),
    minLength: minLength(descriptionFieldMinLength),
    maxLength: maxLength(descriptionFieldMaxLength)
  },
  location: { required: helpers.withMessage('Location is required', required) }
}))

const v$ = useVuelidate(validationRules, event, { $lazy: true })

const petOptions = ref<[RadioOption, RadioOption]>([
  {
    label: 'Yes',
    value: 1
  },
  {
    label: 'No',
    value: 0
  }
])

const resetFormData = () => Object.assign(event, getInitialFormData())
const resetFormValidation = () => v$.value.$reset()
const resetForm = () => {
  resetFormData()
  resetFormValidation()
}

async function onSubmit() {
  const isFormCorrect = await v$.value.$validate()

  if (!isFormCorrect) return

  try {
    const response = await fetch(
      // http://localhost:3000/events
      'https://my-json-server.typicode.com/denys-petryniak/vue-form-mastery/events',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      }
    )

    const data: Event = await response.json()

    alert(`Event created with title: ${data.title}`)
    // eslint-disable-next-line no-console
    console.log(data)
    resetForm()
  } catch (error) {
    console.error(error)
    resetForm()
  }
}
</script>

<template>
  <form class="form" @submit.prevent="onSubmit">
    <h1 class="title">Create an event</h1>
    <fieldset class="mt-12">
      <p>
        <BaseSelect
          v-model="event.category"
          :options="categories"
          label="Select a category"
          :errors="v$.category.$errors"
          @blur="v$.category.$touch"
        />
      </p>
    </fieldset>
    <fieldset class="mt-8">
      <legend class="legend">Name & describe your event</legend>
      <p class="mt-5">
        <BaseInput
          v-model="event.title"
          label="Title"
          type="text"
          :errors="v$.title.$errors"
          @blur="v$.title.$touch"
        />
      </p>
      <p class="mt-5">
        <BaseInput
          v-model="event.description"
          label="Description"
          type="text"
          :errors="v$.description.$errors"
          @blur="v$.description.$touch"
        />
      </p>
    </fieldset>
    <fieldset class="mt-8">
      <legend class="legend">Where is your event?</legend>
      <p class="mt-5">
        <BaseInput
          v-model="event.location"
          label="Location"
          type="text"
          :errors="v$.location.$errors"
          @blur="v$.location.$touch"
        />
      </p>
    </fieldset>
    <fieldset class="mt-8 text-center">
      <legend class="legend">Pets</legend>
      <div class="mt-5">
        <p class="inline-label">Are pets allowed?</p>
        <p class="mt-3 flex justify-center space-x-6">
          <BaseRadioGroup v-model="event.pets" :options="petOptions" name="pets" />
        </p>
      </div>
    </fieldset>
    <fieldset class="mt-8 text-center">
      <legend class="legend">Extras</legend>
      <div class="mt-5 flex justify-center space-x-6">
        <p class="flex">
          <BaseCheckbox v-model="event.extras.catering" label="Catering" />
        </p>
        <p class="flex">
          <BaseCheckbox v-model="event.extras.music" label="Live music" />
        </p>
      </div>
    </fieldset>
    <BaseButton type="submit" :disabled="v$.$errors.length" class="mx-auto mt-12">
      Submit
    </BaseButton>
    <p v-if="v$.$errors.length" class="errorMessage">Please fill out the required fields</p>
  </form>
</template>
