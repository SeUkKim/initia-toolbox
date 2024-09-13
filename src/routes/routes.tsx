import { useRoutes } from 'react-router-dom'
import { FiFileText } from 'react-icons/fi'
import { VscAccount } from 'react-icons/vsc'
import { PiLego } from 'react-icons/pi'
import { IoMdSwap } from 'react-icons/io'
import { ReactComponent as ZeroXOne } from '../../resources/0x1.svg'
import { IoSettingsOutline } from 'react-icons/io5'
import { FaCode } from 'react-icons/fa'
import {
  LandingPage,
  LogsPage,
  AccountsPage,
  BlocksPage,
  TxsPage,
  ABIModulesPage,
  SettingsPage,
  PublishPage
} from '../pages'

const useAppRoutes = () => {
  const menu = [
    {
      name: 'Blocks',
      icon: <PiLego className="w-6 h-6" />,
      path: '/',
      element: <BlocksPage />
    },
    {
      name: 'Txs',
      icon: <IoMdSwap className="w-6 h-6" />,
      path: '/txs',
      element: <TxsPage />
    },
    {
      name: 'Accounts',
      icon: <VscAccount className="w-6 h-6" />,
      path: '/accounts',
      element: <AccountsPage />
    },
    {
      name: '0x1',
      icon: <ZeroXOne className="w-6 h-6" />,
      path: '/execute',
      element: <ABIModulesPage />
    },
    {
      name: 'Publish',
      icon: <FaCode className="w-6 h-6" />,
      path: '/publish',
      element: <PublishPage />
    },
    {
      name: 'Logs',
      icon: <FiFileText className="w-6 h-6" />,
      path: '/logs',
      element: <LogsPage />
    },
    {
      name: 'Settings',
      icon: <IoSettingsOutline className="w-6 h-6" />,
      path: '/settings',
      element: <SettingsPage />
    }
  ]

  const routes = [
    {
      name: 'Landing',
      path: '/landing',
      element: <LandingPage />
    },
    ...menu
  ]

  return {
    menu,
    routes: useRoutes(routes)
  }
}

export default useAppRoutes
