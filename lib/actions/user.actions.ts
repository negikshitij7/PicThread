"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/community.model";

interface paramtypes{
    userId:string,
 username:string,
 name:string,
 bio:string,
 image:string,
 path:string
}

export async function updateUser(
 {
 userId,
 username,
 name,
 bio,
 image,
 path
 }:paramtypes
):Promise<void>{
 connectToDB();
  try{

    await User.findOneAndUpdate(
        {id:userId},
        {
            username:username.toLowerCase(),
            name,
            bio,
            image,
            onboarded:true

        },
        {
            upsert:true
        }
     );
    
      if(path==='/profile/edit')
      {
        revalidatePath(path)
      }
  }
 catch(error:any)
 {
  console.log(error)

 }
}

export async function fetchUser(userId:string)
{
  try {
    connectToDB()
   return await User.findOne({id:userId});

  } catch (error) {
    console.log(`unable to fetch the user: ${error}`)
  }  
}

export async function fetchUserThreads(id:string)
{
  try {
    connectToDB()
    
    const userThreads=await User.findOne({id:id})
    .populate({
      path:"threads",
      model:Thread,
      populate:[{
        path:"community",
        model:Community,
        select:"name id image _id"
      },{
        path:"children",
        model:Thread,
        populate:({
          path:"author",
          model:User,
          select:"id name image"
        })
      }]
    })

    return userThreads
  } catch (error) {
    console.log(error)
  }
}

export async function fetchUsers({userId,searchString='',pageNumber=1,pageSize=20,sortBy="desc"}:{  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;})
{
  try {
  connectToDB();
  const skipamt= (pageNumber-1)*pageSize;
   
  const regex=new RegExp(searchString,'i')
  
  const query:FilterQuery<typeof User>={
    id:{$ne:userId},
  };
  
  if(searchString.trim()!=="")
  {
    query.$or=[
      {username:{$regex:regex}},
      {name:{$regex:regex}},
    ]
  }
  const sortOptions={createdAt:sortBy};
  const usersQuery=User.find(query).sort(sortOptions).skip(skipamt).limit(pageSize);  
  
  const totalUsersCount =await User.countDocuments(query)

  const users= await usersQuery.exec();


  const isNext= totalUsersCount > skipamt + users.length;

  return {users,isNext};
  
} catch (error) {
  console.log(error)
}

}

export async function getActivity(userId:string)
{
try {
 connectToDB(); 
  
 const userThreads=await Thread.find({author:userId})
 
 const allChildren=userThreads.reduce((acc,Thread)=>{(acc.concat(Thread.children))},[])


 //now find all the children threads where the author is not the current user
 const replies=await Thread.find({_id: {$in:allChildren},author:{$ne:userId}})
 .populate({
    path:'author',
    model:User,
    select:'name image _id'
 })
 return replies
} catch (error) {
  console.log(error)
}
}
