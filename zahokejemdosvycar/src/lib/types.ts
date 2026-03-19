export type PrizeType = 'main_trip' | 'prima_voucher' | 'kaufland_voucher' | 'merch' | 'no_prize'

export interface Question {
  id: string
  question_text: string
  options: string[]
  correct_option_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Registration {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  birth_date: string
  question_id: string
  selected_answer: number
  is_correct: boolean
  gdpr_consent: boolean
  terms_consent: boolean
  referral_code: string
  referred_by: string | null
  created_at: string
}

export interface Code {
  id: string
  code: string
  registration_id: string | null
  prize_type: PrizeType
  is_used: boolean
  seat_number: string | null
  used_at: string | null
  created_at: string
}

export interface Seat {
  id: string
  seat_label: string
  is_occupied: boolean
  occupied_at: string | null
  code_id: string | null
}

export interface RegistrationFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  birth_date: string
  question_id: string
  selected_answer: number
  gdpr_consent: boolean
  terms_consent: boolean
  referred_by?: string
}

export const PRIZE_LIMITS: Record<Exclude<PrizeType, 'no_prize'>, number> = {
  main_trip: 20,
  prima_voucher: 100,
  kaufland_voucher: 100,
  merch: 10,
}

export const PRIZE_CONFIG: Record<PrizeType, { label: string; color: string; icon: string }> = {
  main_trip: { label: 'Zájezd na hokej do Švýcarska!', color: '#FFD700', icon: '🏆' },
  prima_voucher: { label: 'Prima+ voucher na 1 měsíc zdarma!', color: '#7C3AED', icon: '🎬' },
  kaufland_voucher: { label: 'Kaufland poukázka 500 Kč!', color: '#C8102E', icon: '🛒' },
  merch: { label: 'Hokejový merch balíček!', color: '#003DA5', icon: '🧢' },
  no_prize: { label: 'Tentokrát bez výhry', color: '#6B7280', icon: '🙂' },
}
