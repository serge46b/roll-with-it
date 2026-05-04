export interface Profile {
  id: number
  nickname: string
  user: string
}

export interface Character {
  id: number
  name: string
  maxHp: number
  currentHp: number
  color: string
  imageUrl?: string
}
