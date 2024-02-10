import { OrganizationSwitcher, SignOutButton, SignedIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Topbar = () => {
  return (
   <nav className='topbar'>
       <Link href="/" className='flex items-center gap-2'>
         <img src="/assets/images/PUK.svg
         " alt="logo" className="h-20 w-20"/>
         <p className="text-white font-bold">PicThread</p>
       </Link>
      
      <div className="flex items-center gap-3">
      <div className='block md:hidden'>
        <SignedIn>
           <SignOutButton>
            
            <Image src="/assets/icons/logout.svg" alt='image' height={28} width={28} />
           </SignOutButton>
        </SignedIn>
        
        </div>

         <OrganizationSwitcher appearance={{baseTheme:dark,elements:{organizationSwitcherTrigger:"py-2 px-2 w-"}}}/> 
        </div>
   </nav>
  )
}

export default Topbar