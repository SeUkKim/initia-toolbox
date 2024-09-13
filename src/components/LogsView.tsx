import Convert from 'ansi-to-html'
import createDOMPurify from 'dompurify'
import { memo } from 'react'

const convert = new Convert({ newline: true })
const DOMPurify = createDOMPurify(window)

const LogsView = ({ log }: { log: any }) => {
  const isBeginningOfBlock = log.includes('Timed out')
  return (
    <>
      {isBeginningOfBlock && <div style={{ height: '0.1rem' }} className="w-full my-1" />}
      <pre
        className="break-words whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(convert.toHtml(log)) }}
      />
    </>
  )
}

export default memo(LogsView)
