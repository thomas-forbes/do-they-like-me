export interface Message {
  from: 'you' | 'them'
  message: string
}

export const ratings = ['Great', 'Good', 'Ok', 'Bad', 'Wrong']
type Ratings  = 'Great'| 'Good'| 'Ok'| 'Bad'| 'Wrong'

export interface MessagesDB {
  messages: Message[]
  rating?: Ratings
}