import React from 'react'
import Layout from '../../layout'
import UsersLayout from '../layout'
import TableSection from './_sections/table-section'

export default function Page() {
  return (
    <Layout>
      <UsersLayout>
        <TableSection />
      </UsersLayout>
    </Layout>
  )
}
