export interface IEvent {
  attributes: IEventAttribute[]
  type: string
}

export interface IEventAttribute {
  key: string
  value: string
  index: boolean
}

export class EventUtils {
  static parseEventsAttributes(events: IEvent[]): IEvent[] {
    return events.map((event) => {
      const attributes = event.attributes.map((attribute) => {
        const key = Buffer.from(attribute.key).toString()
        const value = Buffer.from(attribute.value).toString()

        return { ...attribute, key, value }
      })

      return { ...event, attributes }
    })
  }
}
