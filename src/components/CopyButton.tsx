import { useEffect, useState } from 'react'
import { FaRegCopy } from 'react-icons/fa6'
import { FaCheck } from 'react-icons/fa6'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const CopyButton = (props: any) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 1000)
      return () => clearTimeout(timer)
    }
    return
  }, [copied])

  const onCopy = () => setCopied(true)

  return (
    <CopyToClipboard
      {...props}
      className={`flex text-gray-500 float-right ml-1 items-center ${props.classes}`}
      onCopy={onCopy}
    >
      <button onClick={(e) => e.stopPropagation()} type="button">
        {copied ? <FaCheck className="w-4 h-4" /> : <FaRegCopy className="w-4 h-4" />}
      </button>
    </CopyToClipboard>
  )
}

export default CopyButton
