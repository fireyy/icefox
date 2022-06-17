import React, { useState } from 'react'
import { Popover, PopoverProps, useClasses as clsx, useTheme, useMediaQuery, Drawer } from '@geist-ui/core'

export const DropdownItem = Popover.Item

export const Dropdown = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode } & PopoverProps &
    React.RefAttributes<HTMLDivElement>
>(function Dropdown({ children, className, portalClassName, content, placement='bottomEnd', ...props }, forwardedRef) {
  const theme = useTheme()
  const isMobile = useMediaQuery('xs', { match: 'down' })
  const [visible, setVisible] = useState(false)

  return (
    <>
      {
        isMobile && (
          <div className="drop-menu-box">
            <div className={clsx('dropdown-button', className)} onClick={() => setVisible(true)}>{children}</div>
            <Drawer visible={visible} onClose={() => setVisible(false)} onContentClick={() => setVisible(false)} placement="bottom">
              <Drawer.Content>
                {
                  typeof content === 'function' ? content() : content
                }
              </Drawer.Content>
            </Drawer>
          </div>
        )
      }
      {
        !isMobile && (
          <Popover ref={forwardedRef} placement={placement} hideArrow content={content} portalClassName={clsx('drop-menu-box', portalClassName)} {...props}>
            <div className={clsx('dropdown-button', className)}>{children}</div>
          </Popover>
        )
      }
      <style jsx global>{`
      .tooltip-content.popover.drop-menu-box {
        border: 1px solid ${theme.palette.border};
      }
      .tooltip-content.popover.drop-menu-box > .inner {
          padding: calc(${theme.layout.gapHalf} / 2);
          min-width: 120px;
        }
        .drop-menu-box .item {
          border-radius: 6px;
        }
        .drop-menu-box .item span {
          flex: 1;
        }
        .drop-menu-box .item:hover:not(.title) {
          background-color: ${theme.palette.accents_2};
        }
        .drop-menu-box .item.title {
          font-size: 12px !important;
        }
        .drop-menu-box .item.checked {
          font-weight: 500;
          color: ${theme.palette.accents_8};
          background-color: ${theme.palette.accents_1};
        }
        .drop-menu-box .item.disabled {
          cursor: not-allowed;
          color: ${theme.palette.accents_1};
        }
        .drop-menu-box .item a,
        .drop-menu-box .item .tooltip {
          display: block;
          flex: 1;
          cursor: pointer;
          color: ${theme.palette.accents_5};
        }
      `}</style>
    </>
  )
})
