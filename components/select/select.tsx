import React from 'react'
import { useClasses as clsx } from '@geist-ui/core'
import styles from './select.module.css'
import ChevronUpDown from '@geist-ui/icons/chevronUpDown'

interface Props
  extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  small?: boolean;
  disabled?: boolean;
}

const Select = React.forwardRef<
  HTMLSelectElement,
  Props &
    React.RefAttributes<HTMLSelectElement>
>(({ children, small, disabled, ...props }, ref) => {
  return (
    <div
      className={clsx(styles.container, {
        [styles.disabled]: disabled,
      })}
    >
      <select
        ref={ref}
        disabled={disabled}
        className={clsx(styles.select, {
          [styles.small]: small,
        })}
        {...props}
      >
        {children}
      </select>
      <span className={styles.suffix}>
        <ChevronUpDown size={16} />
      </span>
    </div>
  )
})

Select.displayName = 'Select'

export default Select
