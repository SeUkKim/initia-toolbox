import { EventUtils, IEvent } from '../models/IEvent'
import { memo } from 'react'
import { List, ListItem, Divider, Typography, Box } from '@mui/material'

const EventsView = ({ events }: { events: IEvent[] }) => {
  const eventsAttributes = EventUtils.parseEventsAttributes(events)

  return (
    <Box p={2}>
      {eventsAttributes.length > 0 ? (
        <List>
          {eventsAttributes.map((event, index) => (
            <ListItem
              className="overflow-auto ml-2"
              style={{ alignItems: 'flex-start', flexDirection: 'column' }}
              key={index}
            >
              <Box display="flex" flexDirection="column" width="100%">
                <Typography variant="h6" component="div" className="mb-2">
                  <strong>{event.type}</strong>
                </Typography>
                <Box>
                  {event.attributes.map((attribute, _index) => (
                    <Box key={_index} display="flex" alignItems="center" mb={1} ml={2}>
                      <Typography
                        variant="body2"
                        component="span"
                        className="mr-4 min-w-[100px]"
                        color="textSecondary"
                      >
                        {attribute.key}:
                      </Typography>
                      <Typography variant="body2" component="span">
                        {attribute.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                {index !== eventsAttributes.length - 1 && <Divider />}
              </Box>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No events to display.
        </Typography>
      )}
    </Box>
  )
}

export default memo(EventsView)
