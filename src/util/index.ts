export function truncate(
  text: string = '',
  [headLength, tailLength]: [number, number] = [6, 6]
): string {
  const totalLength = headLength + tailLength

  if (text.length <= totalLength) {
    return text
  }

  const head = text.slice(0, headLength)
  const tail = text.slice(-tailLength)

  return `${head}...${tail}`
}

export function tokenToFloat(token: number): string {
  const n = token / 1000000
  return n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)
}

export function extractMessageTypAndCount(messages: any): { [key: string]: number } {
  const messageCounts: { [key: string]: number } = {}

  // Iterate through the messages array
  messages.forEach((msg) => {
    if (msg['@type'] && typeof msg['@type'] === 'string') {
      const typeStr = msg['@type']
      const parts = typeStr.split('.')
      const msgType = parts[parts.length - 1]

      // Count occurrences of each message type
      if (msgType in messageCounts) {
        messageCounts[msgType] += 1
      } else {
        messageCounts[msgType] = 1
      }
    }
  })

  return messageCounts
}
