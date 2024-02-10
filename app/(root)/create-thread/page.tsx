import PostForm from "@/components/forms/PostForm";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs"
import mongoose from "mongoose";
import { redirect } from "next/navigation";

const page = async() => {
  const user=await currentUser();
  
  if(!user)
  {
    return null
  }
  
  const userdetail=await fetchUser(user.id);

  if(userdetail.onboarded==false)
  {
    redirect('/onboarding');
  }
  
  
    return (
        <>
        <h1 className='head-text'>Create Thread</h1>
         <PostForm userId={userdetail._id}/>  
        </>
     )
}

export default page