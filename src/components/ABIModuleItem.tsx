import { Badge, Box, Card, SxProps, Typography } from '@mui/material'

interface Props extends ABIFunction {
  isActive?: boolean
  onClick?: () => void
}

const ABIModuleItem = ({ method, functionName, isActive, onClick }: Props) => {
  const color = { view: 'blue', execute: 'violet' }[method] || 'default'

  // Define styles with MUI's sx prop
  const styles: SxProps = {
    cursor: 'pointer',
    backgroundColor: isActive ? (color === 'blue' ? '#e0f7fa' : '#f3e5f5') : '#ffffff',
    '&:hover': {
      backgroundColor: color === 'blue' ? '#b2ebf2' : '#f3d9f4',
      transform: 'scale(1.02)'
    },
    padding: '16px',
    borderRadius: '8px',
    transition: 'background-color 0.3s, transform 0.3s'
  }

  return (
    <Card sx={styles} onClick={onClick} variant="outlined">
      <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
        <Badge
          className="top-1.5"
          badgeContent={method}
          color={color === 'blue' ? 'primary' : 'secondary'}
          sx={{ fontSize: '12px', padding: '6px 12px', borderRadius: '8px' }}
        />
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, fontSize: '16px', color: 'text.primary' }}
        >
          {functionName}
        </Typography>
      </Box>
    </Card>
  )
}

export default ABIModuleItem
