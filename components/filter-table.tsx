import React, { useEffect, useState, Fragment } from 'react'
import {
  Grid,
  Table,
  Text,
  Button,
  Spacer,
  Code,
} from '@geist-ui/core'
import InputFilter from 'components/input-filter'
import Skeleton from 'components/skeleton'

type Props = {
  data: any
  filter?: string[]
  buttons?: React.ReactNode
  children: React.ReactNode
}

type FilterItem = {
  name: string
  value: string
}

const deep_value = (o: any, p: string) => o ? p.split('.').reduce((a, v) => a?.[v], o) : null

const FilterTable: React.FC<Props> = ({ data = [], filter = [], children, buttons }) => {
  const [filters, setFilters] = useState<FilterItem[]>([])
  const [keyData, setKeyData] = useState<[]>(data)
  const [isClear, setIsClear] = useState(0)

  useEffect(() => {
    if (data && filters && filters.length > 0) {
      const filterResult = data.filter((item: any) => {
        return filters.every((f: FilterItem) => String(deep_value(item, f.name)).toLowerCase().includes(f.value.toLowerCase()))
      })
      setKeyData(filterResult)
    } else if ((data.length !== keyData.length) && (filters && filters.length === 0)) {
      // reset
      setKeyData(data)
    }
  }, [data, filters])

  const handleFilterChange = (name: string, value: string, callback = () => {}) => {
    if (data) {
      if (value) {
        setFilters([...filters.filter((item: FilterItem) => item.name !== name), {
          name,
          value
        }])
      } else {
        setFilters([...filters.filter((item: FilterItem) => item.name !== name)])
      }
      callback && callback()
    }
  }
  const handleClearSearch = () => {
    setFilters([])
    setIsClear(isClear+1)
  }
  return (
    <>
      <Grid.Container gap={2} justify="flex-start">
        <Grid md={12}>
          {
            filter.map((item: string) => (
              <Fragment key={item}>
                <InputFilter name={item} onCallback={handleFilterChange} isClear={isClear} />
                <Spacer w={0.5} />
              </Fragment>
            ))
          }
        </Grid>
        <Grid md={12} justify="flex-end">
          {buttons}
        </Grid>
        <Grid md={24} direction="column">
          <Table data={keyData} emptyText="No Data to show">
            {children}
          </Table>
        </Grid>
        {
          !data || data.length === 0 && [{}, {}, {}].map((_, index) => (
            <Grid key={index} md={24} direction="row">
              <Skeleton width={120} />
              <Spacer w={2} />
              <Skeleton width={240} />
              <Spacer w={2} />
              <Skeleton autoSize />
            </Grid>
          ))
        }
        {
          keyData && keyData.length === 0 && filters.length > 0 && (
            <Grid md={24} direction="column" alignItems="center">
              <Text>No results for <Code>{filters.map(f => `${f.name}=${f.value}`).join(', ')}</Code></Text>
              <Button auto onClick={handleClearSearch}>Clear Search</Button>
            </Grid>
          )
        }
      </Grid.Container>
    </>
  )
}

export default FilterTable
