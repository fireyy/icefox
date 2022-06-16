import React, { useState } from 'react'
import type { NextPage } from 'next'
import Error from 'next/error'


const NoPermission: NextPage = () => {
  return <Error statusCode={401} title="No Permission here" />
}

export default NoPermission
