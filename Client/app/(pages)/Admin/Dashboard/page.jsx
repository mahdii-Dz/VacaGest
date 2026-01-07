import React from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import AdminDashboard from '@/components/AdminDashboard'

function page() {
  return (
    <div className='flex'>
        <AdminSidebar/>
        <AdminDashboard/>
    </div>
  )
}

export default page