

import AccountProfile from '@/components/forms/AccountProfile';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import { imageConfigDefault } from 'next/dist/shared/lib/image-config';
import React from 'react'

const page = async() => {
  
  const user=await currentUser();
  
  if(!user)
  {
    return null
  }
   
  const userFromDB=await fetchUser(user.id);

  if(userFromDB.onboarded)
  {
    redirect('/')
  }


  const userData={
    userId:user?.id,
    objectId:userFromDB?._id,
    name:userFromDB? userFromDB.name:user?.firstName||"",
    username:userFromDB? userFromDB.username:user.username,
    image:userFromDB? userFromDB.image:user.imageUrl,
    bio:userFromDB? userFromDB.bio:""
  }

  return (
   <main className="flex  flex-col p-6 gap-5 mx-4 items-start">
     
    <h3 className="text-white text-heading1-bold">Onboarding</h3>
    <p className='text-white'>Complete your profile to use PicThreads</p>
     
     <section className="bg-dark-4 rounded p-10 w-full">
      <AccountProfile user={userData} btnTitle="Continue"/>
     </section>
   </main>
  )
}

export default page