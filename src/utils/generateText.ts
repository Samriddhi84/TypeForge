import { words } from '../data/words'

export function generateText(wordCount: number): string {
  const generatedWords: string[] = []

  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * words.length)

    generatedWords.push(words[randomIndex])
  }

  return generatedWords.join(' ')
}