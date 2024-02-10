"use server"

import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import mongoose from "mongoose"
import Community from "../models/community.models"


interface param{
    text:string,
    author:string,
    communityId:string | null,
    path:string
}


export async function createThread({text,author,path,communityId}:param){

  const authorid=new mongoose.Types.ObjectId(author);

try {
    connectToDB();
    if(communityId)
    {
    const iscommunity=await Community.findOne({id:communityId}) 
    
    if(!iscommunity)
    {
      throw new Error("No such community Exists")
    }
    }

    const createdThread=await Thread.create(
        {
            text,
             authorid,
            community:communityId
        }
    )

    await User.findByIdAndUpdate(author,
        {
        $push:{threads:createdThread._id}
    })

   
    await Community.findByIdAndUpdate(communityId,
      {$push:{threads:createdThread._id}})


   revalidatePath(path);

} catch (error) {
    console.log(error)
}


}


export async function fetchPosts(pageNumber=1,pageSize=20)
{
 try {
    connectToDB();

   const skipamt=(pageNumber-1)*pageSize; // total threads fetched so far

   const postsQuery= 
   Thread.find({parentId: {$in:['null','undefined']}})
   .skip(skipamt)
   .populate({path:'author',model:User}) // populate with the creator of the thread
   .populate({path:'children',populate:{path:'author',model:User,select:"_id name parentId image"}}) // populate with the children and get the creator of the children along with certain attributes
    
    const totalPostsCount=await Thread.countDocuments({parentId:{$in:["null","undefined"]}})
     
    const posts=await postsQuery.exec();

    const isMoreToFetch= totalPostsCount > posts.length + skipamt;
   
    return {posts,isMoreToFetch};
 } catch (error) {
    console.log(error)
 }
}

export async function updateLikes(threadId:string,likesArray:string[])
{
 connectToDB()
 try{
   await Thread.findByIdAndUpdate(threadId,{
    $set:{
        likes:likesArray
    }
   })

 }
catch(error)
{
    console.log(error)
}

}


export async function fetchPostByID(id:string)
{
try {
    connectToDB();

   const post= await Thread.findOne({id:id})
    .populate({
        path:'author',
        model: User,
        select:"_id id name image"
    })
    .populate({path:"children",
    populate:[{path:'author',model:User,select:"_id id name parentId image"},
        {
          path:'children',
          model:Thread,
          populate:{
            path:'author',
            model:User,
            select:"_id id name parentId image"
          }  
        }]}).exec();


  
        return post
      

} catch (error) {
    console.log(error)
}
}

export async function createComment(userId:string,threadId:string,commentText:string,path:string)
{

  try {
     connectToDB();

    const parentThread=await Thread.findById({threadId})
  
    if(!parentThread)
    {
      throw new Error("Thread not Found")
    }

    const comment=new Thread({
       text:commentText,
       author:userId,
       parentId:userId
    })

    await comment.save();

    parentThread.children.push(comment._id)
    
    await parentThread.save();

    revalidatePath(path)
  } catch (error) {
    console.log(error)
  }
}


/// a complex function
export async function deleteThread(threadId:string,path:string):Promise<void>
{
try {
   connectToDB()
   //Step 1:Get the thread to be deleted along with the author and the community the thread is associated with
    const deletedThread=await Thread.findOne({id:threadId}).populate("author community")
       
     if(!deletedThread)
     {
      throw new Error("Thread not found")
     }

      // recursively find all the child threads because the children can themselves have children
     const descendantThreads=await fetchAllChildThreads(threadId);
     

     //extract just the ids of all the threads to be deleted
     const threadsToBeDeleted=[
      threadId,
      ...descendantThreads.map((child)=>child._id)
     ]

     //make an array of all the associated authors from which the threadids will be removed

     const associatedAuthors= new Set(
      [
        ...descendantThreads.map((child)=>child.author?._id?.toString()),
         deletedThread.author._id.toString(),
      ].filter((id)=>id!==undefined)
     );

     //make an array of all the associated communities from which the threadids will be removed

     const uniqueCommunityIds=new Set(
     [
      ...descendantThreads.map((child)=>child.community._id.toString()),
      deletedThread.community._id.toString(),
     ].filter((id)=>id!==undefined))
    

     //delete all the threads with the thread ids
     await Thread.deleteMany({id: {$in:threadsToBeDeleted}})
   
     //pull out all the thread ids to be deleted from all the associated users
     await User.updateMany({_id:{$in:Array.from(associatedAuthors)}},{$pull:{threads:{$in:threadsToBeDeleted}}})

     
     //pull out all the thread ids to be deleted from all the associated communities
     await Community.updateMany({_id:{$in:Array.from(uniqueCommunityIds)}},{$pull:{threads:{$in:threadsToBeDeleted}}})
       
    revalidatePath(path)

 } catch (error:any) {
  console.log(error)
 }
}


export async function fetchAllChildThreads(threadId:string):Promise<any[]>
{
  const immediateChildren=await Thread.find({parentId:threadId});
  
  let allDescendent=[];

  for(const child of immediateChildren)
  {
    const descendants=await fetchAllChildThreads(child._id);
    allDescendent.push(child,descendants);
  }
  
  return allDescendent
  
}