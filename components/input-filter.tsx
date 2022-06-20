import React, { useEffect, useState, forwardRef } from 'react'
import {
  Input,
  useInput,
  Spinner,
} from '@geist-ui/core'
import type { InputProps } from '@geist-ui/core'
import useDebounce from 'lib/use-debounce'
import Filter from '@geist-ui/icons/filter'

type Props = InputProps & {
  name: string
  onCallback: (name: string, value: string, callback?: () => void) => void
  isClear: number
}

const InputFilter = forwardRef<HTMLInputElement, Props>(({ name, onCallback, isClear, ...props }, ref) => {
  const [onComposition, setOnComposition] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { bindings: inputBindings, setState: setInput, state: input, reset } = useInput('')
  const debouncedSearchTerm: string = useDebounce<string>(input, 500)

  useEffect(
    () => {
      if (debouncedSearchTerm && !onComposition) {
        setLoading(true)
        onCallback && onCallback(name, input, () => {
          setLoading(false)
        })
      } else {
        onCallback && onCallback(name, '')
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
          ref={ref}
          placeholder={`${name} filter`}
          onCompositionStart={handleComposition}
          onCompositionUpdate={handleComposition}
          onCompositionEnd={handleComposition}
          clearable
          iconRight={loading ? <Spinner scale={1/3} /> : undefined}
          icon={<Filter />}
          {...props}
          {...inputBindings}
        />
      </div>
    </>
  )
})

InputFilter.displayName = 'InputFilter'

export default InputFilter
