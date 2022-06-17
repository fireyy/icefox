import React, { useEffect, useState } from 'react'
import {
  Input,
  useInput,
  Spinner,
} from '@geist-ui/core'
import useDebounce from 'lib/use-debounce'

type Props = {
  name: string
  onChange: (name: string, value: string, callback?: () => void) => void
  isClear: number
}

const InputFilter: React.FC<Props> = ({ name, onChange, isClear }) => {
  const [onComposition, setOnComposition] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { bindings: inputBindings, setState: setInput, state: input, reset } = useInput('')
  const debouncedSearchTerm: string = useDebounce<string>(input, 500)

  useEffect(
    () => {
      if (debouncedSearchTerm && !onComposition) {
        setLoading(true)
        onChange && onChange(name, input, () => {
          setLoading(false)
        })
      } else {
        onChange && onChange(name, '')
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  )

  useEffect(
    () => {
      isClear && reset()
    },
    [isClear]
  )

  const handleComposition = (e: React.CompositionEvent<HTMLInputElement>) => {
    if (e.type === 'compositionend') {
      setOnComposition(false)
    } else {
      setOnComposition(true)
    }
  }

  return (
    <>
      <div className="input-filter">
        <Input
          placeholder={`${name} filter`}
          onCompositionStart={handleComposition}
          onCompositionUpdate={handleComposition}
          onCompositionEnd={handleComposition}
          clearable
          iconRight={loading ? <Spinner scale={1/3} /> : undefined}
          {...inputBindings}
        />
      </div>
    </>
  )
}

export default InputFilter
