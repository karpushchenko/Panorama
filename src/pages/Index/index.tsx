import React, { memo } from 'react'

import Box from '../../components/Box'

import styles from './index.module.css'
import Panorama from './Panorama'

interface Props {}

const Index: React.FC<Props> = memo(() => {
  return (
    <>
      <Box>
        <h1 className={styles.h1}>Visualizzatore di appartamenti 3d</h1>
      </Box>
      <Panorama />
    </>
  )
})
Index.displayName = 'Index'

export default Index
