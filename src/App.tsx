import useAppRoutes from './routes/routes'
import { useCallback, useEffect, useState } from 'react'
import { BsArrowLeftShort, BsStack } from 'react-icons/bs'
import { NavLink, useNavigate } from 'react-router-dom'
import { debounce } from 'lodash'
import { useInitiaLatestHeight, useIsInitiaStart, useIsInstalled } from './hooks/InitiaHooks'

function App(): JSX.Element {
  const { menu, routes } = useAppRoutes() // routes
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState<boolean>(true) // sidebar open state
  const [isLoading, setIsLoading] = useState(false)
  const isInitiaStart = useIsInitiaStart() // use state for initia start
  const isInstalled = useIsInstalled() // use state for local-initia installed
  const initiaLatestHeight = useInitiaLatestHeight()
  const [selectedItem, setSelectedItem] = useState('local-initia') // chain id dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false) // dropdown

  useEffect(() => {
    if (!isInstalled.get()) {
      navigate('/landing')
    } else {
      navigate('/')
    }
  }, [])

  useEffect(() => {
    if (isInitiaStart.get() === null) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [isInitiaStart, initiaLatestHeight])

  const onClickInitiaButton = useCallback(
    debounce(() => toggleInitia(), 3000, { leading: true, trailing: false, maxWait: 3000 }),
    []
  )

  const toggleInitia = () => {
    setIsLoading(true)
    window.electron.ipcRenderer.invoke('toggleInitia', !isInitiaStart.get())
    isInitiaStart.set(null)
  }

  const onClickDropdownButton = () => setIsDropdownOpen(!isDropdownOpen)
  const onClickItem = (item) => {
    setSelectedItem(item)
    setIsDropdownOpen(false)
  }

  return (
    <div className="flex flex-col w-screen h-screen bg-white">
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`left-nav bg-gradient-to-b from-black via-gray-900 to-gray-800 h-screen p-5 pt-7 shadow-lg ${isOpen ? 'w-64' : 'w-20'} duration-300 relative`}
        >
          {/* Toggle Button */}
          <BsArrowLeftShort
            className={`bg-gray-800 text-white text-3xl rounded-full absolute -right-4 top-8 border border-gray-600 shadow-lg cursor-pointer transition-transform duration-300 z-50 ${!isOpen && 'rotate-180'}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Sidebar"
          />
          {/* Sidebar Header */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="w-12 h-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className={`object-contain cursor-pointer transition-transform duration-700 ${isOpen && 'rotate-[360deg]'}`}
              >
                <circle fill="white" cx="16" cy="16" r="16" />
                <path
                  fill="black"
                  d="M20.078 25.75v-3.186a2.946 2.946 0 0 1-2.502-2.908v-7.312a2.946 2.946 0 0 1 2.502-2.908V6.25a6.14 6.14 0 0 0-4.084 2.01 6.187 6.187 0 0 0-4.084-2.01v3.186a2.946 2.946 0 0 1 2.502 2.908v7.312a2.946 2.946 0 0 1-2.502 2.908v3.186a6.14 6.14 0 0 0 4.084-2.01 6.187 6.187 0 0 0 4.084 2.01Z"
                />
              </svg>
            </div>
            {/* "Initia" Logo Text */}
            {isOpen && (
              <div className="ml-4">
                <svg
                  width="81"
                  height="24"
                  viewBox="0 0 81 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white font-semibold text-2xl"
                >
                  <g clipPath="url(#clip0_396_40560)">
                    <path
                      d="M36.8463 8.36919H40.2014V9.82058C40.5333 9.30746 40.9806 8.9043 41.5434 8.61109C42.1062 8.30322 42.77 8.14928 43.5348 8.14928C44.7614 8.14928 45.7643 8.55978 46.5435 9.38077C47.3372 10.1871 47.734 11.4186 47.734 13.0752V19.8044H44.379V13.669C44.379 12.9213 44.1986 12.3202 43.8378 11.8657C43.4771 11.4113 42.9576 11.184 42.2793 11.184C41.6155 11.184 41.1033 11.4186 40.7425 11.8877C40.3817 12.3422 40.2014 12.936 40.2014 13.669V19.8044H36.8463V8.36919Z"
                      fill="white"
                    ></path>
                    <path
                      d="M49.7618 8.36919H53.1169V19.8044H49.7618V8.36919ZM49.7618 4.19093H53.1169V7.15969H49.7618V4.19093Z"
                      fill="white"
                    ></path>
                    <path
                      d="M59.8708 19.9364C58.7741 19.9364 57.9011 19.6432 57.2517 19.0567C56.6023 18.4557 56.2777 17.532 56.2777 16.2859V11.0741H54.6109V8.36919H56.2777V5.44441H59.6327V8.36919H61.9921V11.0741H59.6327V15.7361C59.6327 16.0733 59.741 16.3592 59.9574 16.5938C60.1739 16.8137 60.513 16.9236 60.9748 16.9236C61.3211 16.9236 61.6746 16.865 62.0354 16.7477V19.3426C61.8334 19.5479 61.5303 19.7018 61.1263 19.8044C60.7367 19.8924 60.3182 19.9364 59.8708 19.9364Z"
                      fill="white"
                    ></path>
                    <path
                      d="M63.5863 8.36919H66.9414V19.8044H63.5863V8.36919ZM63.5863 4.19093H66.9414V7.15969H63.5863V4.19093Z"
                      fill="white"
                    ></path>
                    <path
                      d="M73.8035 20.0243C72.9089 20.0243 72.0502 19.7971 71.2277 19.3426C70.4052 18.8881 69.7342 18.2138 69.2147 17.3195C68.6952 16.4252 68.4354 15.3476 68.4354 14.0868C68.4354 12.826 68.6952 11.7484 69.2147 10.8542C69.7342 9.95986 70.4052 9.28547 71.2277 8.831C72.0502 8.37652 72.9089 8.14928 73.8035 8.14928C74.4096 8.14928 74.9508 8.24457 75.427 8.43516C75.9176 8.61109 76.3072 8.81634 76.5958 9.0509C76.8844 9.28547 77.0648 9.49072 77.137 9.66665H77.2019V8.36919H80.557V19.8044H77.2019V18.507H77.137C77.0648 18.6829 76.8844 18.8881 76.5958 19.1227C76.3072 19.3573 75.9176 19.5699 75.427 19.7604C74.9508 19.9364 74.4096 20.0243 73.8035 20.0243ZM71.7472 14.0868C71.7472 14.9664 72.0142 15.6701 72.5481 16.1979C73.0965 16.7257 73.7458 16.9896 74.4962 16.9896C75.2755 16.9896 75.932 16.733 76.466 16.2199C77.0143 15.6921 77.2885 14.9811 77.2885 14.0868C77.2885 13.1925 77.0143 12.4888 76.466 11.9757C75.932 11.4479 75.2755 11.184 74.4962 11.184C73.7458 11.184 73.0965 11.4479 72.5481 11.9757C72.0142 12.5035 71.7472 13.2072 71.7472 14.0868Z"
                      fill="white"
                    ></path>
                    <path
                      d="M31.3926 8.36918H34.7477V19.8044H31.3926V8.36918ZM31.3926 4.19092H34.7477V7.15968H31.3926V4.19092Z"
                      fill="white"
                    ></path>
                  </g>
                </svg>
              </div>
            )}
          </div>

          {/* Menu */}
          <nav className="mt-10">
            <ul className="space-y-2">
              {menu.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors duration-200 text-white hover:bg-gray-700 ${
                      isActive ? 'bg-gray-700' : 'bg-transparent'
                    }`
                  }
                  aria-label={item.name}
                >
                  <div className="text-2xl">{item.icon}</div>
                  {isOpen && <span className="ml-4 text-base font-medium">{item.name}</span>}
                </NavLink>
              ))}
            </ul>
          </nav>
        </div>

        {/* Top Navbar */}
        <div className="relative flex-auto w-full h-screen overflow-hidden">
          <header className="absolute bg-white w-full z-40 flex justify-between p-3.5 pl-12 border-b border-[#CFD8EA] shadow-light-bottom">
            <ul className="flex space-x-6">
              <li className="flex-col px-2 font-medium text-sm text-gray-500">
                <p>Current Block</p>
                <p className="text-sm text-gray-500">{initiaLatestHeight}</p>
              </li>
              <li className="flex-col px-2 font-medium text-sm text-gray-500">
                <p>Chain ID</p>
                {/*<p className="text-sm text-gray-500"> local-initia</p>*/}
                <div className="relative">
                  <button
                    onClick={onClickDropdownButton}
                    className="inline-flex items-center justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none"
                  >
                    {selectedItem}
                    <svg
                      className={`ml-2 w-4 h-4 transform transition-transform ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
                      <li
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => onClickItem('local-initia')}
                      >
                        local-initia
                      </li>
                      {/*<li*/}
                      {/*  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"*/}
                      {/*  onClick={() => onClickItem('minimove')}*/}
                      {/*>*/}
                      {/*  minimove*/}
                      {/*</li>*/}
                    </ul>
                  )}
                </div>
              </li>
              <li className="flex-col px-2 font-medium text-sm text-gray-500">
                <p>RPC</p>
                <p className="text-sm text-gray-500">
                  <a href="http://localhost:26657" target="_blank" rel="noreferrer">
                    http://localhost:26657
                  </a>
                </p>
              </li>
              <li className="flex-col px-2 font-medium text-sm text-gray-500">
                <p>LCD</p>
                <p className="text-sm text-gray-500">
                  <a href="http://localhost:1317" target="_blank" rel="noreferrer">
                    http://localhost:1317
                  </a>
                </p>
              </li>
            </ul>

            <div className="ml-auto">
              <button
                type="button"
                onClick={onClickInitiaButton}
                className={`inline-flex items-center text-gray-500 bg-white hover:bg-gray-100 font-semibold py-2 px-6 border border-gray-400 rounded shadow ${
                  isLoading && 'cursor-wait'
                }`}
              >
                <BsStack
                  className={`w-[15px] mr-2 ${
                    isLoading
                      ? 'fill-yellow-500'
                      : isInitiaStart.get()
                        ? 'fill-green-500'
                        : 'fill-red-500'
                  }`}
                />
                Initia
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex w-full h-full overflow-hidden pt-[80px]">{routes}</main>
        </div>
      </div>
    </div>
  )
}

export default App
