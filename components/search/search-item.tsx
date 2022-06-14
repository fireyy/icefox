import React, { MouseEvent, FocusEvent } from 'react'
import { SearchResults } from './helper'
import { Text, useTheme } from '@geist-ui/core'

export type SearchItemProps = {
  data: SearchResults[number]
  onMouseOver: (e: MouseEvent<HTMLButtonElement>) => void
  onSelect: (url: string) => void
  onFocus: (e: FocusEvent<HTMLButtonElement>) => void
  onBlur?: (e: FocusEvent<HTMLButtonElement>) => void
}

const SearchItem: React.FC<SearchItemProps> = ({
  data,
  onMouseOver,
  onSelect,
  onFocus,
  onBlur = () => {},
}) => {
  const theme = useTheme()
  const selectHandler = () => {
    onSelect('/data')
  }

  return (
    <li role="option" aria-selected="true">
      <button
        className="container"
        onClick={selectHandler}
        onMouseOver={onMouseOver}
        onFocus={onFocus}
        onBlur={onBlur}
        data-search-item>
        <Text font="14px" className="value" span>
          {data.name}:{data.value} - {data.comment}
        </Text>
        <style jsx>{`
          .container {
            width: 100%;
            height: 48px;
            padding: 0 1rem;
            display: flex;
            align-items: center;
            cursor: pointer;
            position: relative;
            transition: color 200ms ease;
            outline: none;
            border: 0;
            color: ${theme.palette.accents_4};
            background-color: transparent;
          }
          .container:focus {
            color: ${theme.palette.foreground};
          }
          .container :global(.image) {
            max-width: 16px;
            margin: 0;
            border-radius: 0;
          }
          .container :global(.image img) {
            vertical-align: top;
          }
        `}</style>
      </button>
    </li>
  )
}

export default SearchItem
