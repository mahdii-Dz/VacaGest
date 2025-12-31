import OtpInput from '@/components/OtpInput'
import Image from 'next/image'
import React from 'react'

function page() {
  return (
    <section className='w-full h-dvh flex flex-col justify-start pt-20 items-center'>
        <Image loading='eager' src={'/VacaGest.svg'} width={176} height={53} alt="VacaGest Logo" />
        <h2 className='text-xl font-semibold text-center mt-4'>Vérification de l'email</h2>
        <p className='mt-4'>Consultez votre boîte de réception et récupérez le code PIN que vous avez reçu.</p>
        <OtpInput/>
    </section>
  )
}

export default page