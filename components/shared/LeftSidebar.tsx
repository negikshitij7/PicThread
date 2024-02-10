"use client"

import React from 'react'
import {sidebarLinks} from '../../constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { SignOutButton, SignedIn, useAuth } from '@clerk/nextjs'



const LeftSidebar = () => {

  const {userId}=useAuth();
   const router=useRouter();
  const pathname=usePathname();
  return (
   <section className='custom-scrollbar leftsidebar '>
    <div className='flex flex-col w-full gap-5 p-3'>
    {sidebarLinks.map((link)=>{
     
     const isActive= (pathname.includes(link.route) && link.route.length>0 ||pathname===link.route )     
     return(

        <Link href={link.route==='/profile'?(`/profile/${userId}`):(link.route)} key={link.label} className={`flex items-center gap-2 p-4 ${isActive?("bg-primary-500"):( "hover:bg-dark-4")} rounded`}>
           <img src={link.imgURL} alt="img" width={28} height={28}/>
            <p className='text-white max-lg:hidden'>{link.label}</p>
        </Link>
    )})}
    </div>

    <div className='mx-4'>
      <SignedIn>
        <SignOutButton signOutCallback={()=>router.push('/sign-in')}>
        <img src="/assets/icons/logout.svg" alt='image' height={24} width={24} className="hover:cursor-pointer  hover:opacity-60"/> 
        </SignOutButton>
      </SignedIn>
    </div>

   </section>
  )
}

export default LeftSidebar