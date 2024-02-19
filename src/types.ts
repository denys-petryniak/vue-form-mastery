interface Extras {
  catering: boolean
  music: boolean
}

export type Category =
  | 'sustainability'
  | 'nature'
  | 'animal welfare'
  | 'housing'
  | 'education'
  | 'food'
  | 'community'

export interface Event {
  category: string
  title: string
  description: string
  location: string
  pets: number
  extras: Extras
}

export interface RadioOption {
  label: 'Yes' | 'No'
  value: 0 | 1
}

export type ModelValue = string | number
