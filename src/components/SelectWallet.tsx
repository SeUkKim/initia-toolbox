import { useInitia } from '../hooks/InitiaHooks'
import { FormControl, MenuItem, Select } from '@mui/material'
import { truncate } from '../util'
import { CopyButton } from './index'

const SelectWallet = ({ onWalletChange, selected }: { onWalletChange: any; selected: string }) => {
  const { wallets } = useInitia()
  return (
    <FormControl fullWidth size="small">
      <Select
        value={selected}
        onChange={onWalletChange}
        className="text-sm bg-white rounded-lg"
        classes={{ select: 'rounded-lg leading-[21px] py-3.5 pr-8 pl-3' }}
        variant="outlined"
      >
        {Object.keys(wallets).map((name: any) => (
          <MenuItem key={name} value={name} classes={{ root: 'justify-between' }}>
            {name}
            {':  '}
            {truncate(wallets[name].key.accAddress, [12, 10])}
            {name !== selected && <CopyButton text={wallets[name].key.accAddress} />}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SelectWallet
