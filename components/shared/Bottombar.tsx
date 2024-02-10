"use client"
import { sidebarLinks } from '@/constants'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Bottombar = () => {
  const {userId}=useAuth();
  const pathname=usePathname()
  return (
    
   <section className="bottombar">
    <div className='bottombar-container'>

      <div className='flex flex-1 items-center justify-between'>    
       {sidebarLinks.map((link)=>
       {
         const isActive=(pathname.includes(link.route) && link.route.length>0 || pathname===link.route)

        return(
         <Link href={link.route==='/profile'?(`/profile/${userId}`):(link.route)} key={link.label} className={`${isActive && "bg-primary-500"} p-2 rounded hover:opacity-70`}>
          <div className='flex flex-col items-center gap-2'>
          <img src={link.imgURL} alt="" className='w-6 h-6 ' />
          <p className="text-light-2 max-sm:hidden text-subtle-medium text-wrap">{link.label}</p>
          </div>
         </Link>
        
        )
       })}        
     </div>
  
    </div>
   </section>


  )
}

export default Bottombar