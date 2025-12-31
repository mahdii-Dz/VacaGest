'use client'
import { createContext, useState } from 'react'

export const GLobalContext = createContext(null)

function Context ({children}) {
    const [FormData, setFormData] = useState({
        fName: '',
        lName: '',
        email: '',
        phone: 0,
        grade: '',
        specialty: '',
        statue: '',
        password: '',
    })
  return (
    <GLobalContext.Provider value={{FormData,setFormData}}>
        {children}
    </GLobalContext.Provider>
  )
}

export default Context

