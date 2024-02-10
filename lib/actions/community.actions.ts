import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/community.models.js";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"

export async function createCommunity(  id: string,
    name: string,
    username: string,
    image: string,
    bio: string,
    createdById:string){
    try {
        connectToDB();

        const creatorUser=await User.findOne({id:createdById})
      
        if(!creatorUser)
        {
            throw new Error("user not found");
        }

        const newCommunity=new Community({
            id,
            name,
            username,
            image,
            bio,
            createdBy:creatorUser._id
        })

        const createdCommunity=await newCommunity.save();

        creatorUser.communities.push(createdCommunity._id)
        
        await creatorUser.save();

        return createdCommunity

    } catch (error) {
        console.log(error)
    }
}

export async function fetchCommunityDetails(id:string){
    try
    {
      connectToDB();
   
      const communityDetails=await Community.findOne({id})
      .populate(["createdBy",{path:"members",model:User,select:"name username image _id id"}])
      
  
    return communityDetails

    }
    catch(error)
    {
        console.log(error)
    }
}

export async function fetchCommunityPosts(id:string){
 try{
    connectToDB();

    const communityPosts=await Community.findOne({id})
    .populate({path:"threads",model:Thread
    ,populate:[{
        path:"author",
        model:User
    },
     {
        path:"children",
        model:Thread,
        populate:{
            path:"author",
            model:User,
            select:"image _id",
        }
     }
    
    ]
})

return communityPosts
 }
 catch(error)
 {
    console.log(error)
 }

}


//pagination and searching
export async function fetchCommunities({searchString="",pageNumber=1,pageSize=20,sortBy="desc"}:{searchString?:string,pageNumber?:number,pageSize?:number,sortBy?:SortOrder}){
try {
   connectToDB();
   
   const skipamt=(pageNumber-1) * pageSize;

   const regex=new RegExp(searchString,'i');

   const query:FilterQuery<typeof Community>={};

   if(searchString.trim()!=="")
   {
    query.$or=[
        {username:{$regex:regex}},
        {name:{$regex:regex}}
    ]
   }


   const sortOptions={createdAt:sortBy};


   const communityQuery=Community.find(query).sort(sortOptions).skip(skipamt).limit(pageSize).populate("members")
   
   const totalCommunities=await Community.countDocuments(query);

   const communities=await communityQuery.exec()

   const isNext=totalCommunities > skipamt  + communities.length;


   return {communities,isNext}
} catch (error) {
    console.log(error)
}

}

export async function addMemberToCommunity(communityId:string,memberId:string)
{
    try {
       connectToDB();

       const getCommunity=await Community.findOne({id:communityId})

       if(!getCommunity)
       {
        throw new Error("Community not found")
       }

       const user=await User.findOne({id:memberId})

       if(!user)
       {
        throw new Error("User not found")
       }

       if(getCommunity.members.includes(memberId))
       {
        throw new Error("User is already a member of the community")
       }


       getCommunity.members.push(user._id);
       await getCommunity.save();

       user.communities.push(getCommunity._id)
       await user.save();


       return getCommunity;

    } catch (error) {
        console.log(error)
    }
}

export async function removeUserFromCommunity(userId:string,communityId:string)
{
    try{
    connectToDB();

    const getCommunity=await Community.findOne({id:communityId})

    if(!getCommunity)
    {
     throw new Error("Community not found")
    }

    const user=await User.findOne({id:userId})

    if(!user)
    {
     throw new Error("User not found")
    }

    if(!getCommunity.members.includes(userId))
    {
     throw new Error("User is not a member of the community")
    }

    await Community.updateOne(
        {_id:getCommunity._id},
        {$pull:{members:user._id}}
    );

    return {success:true};
    }
    catch(error)
    {
        console.log(error);
    }
}

export async function upadateCommunityInfo(
    communityId: string,
    name: string,
    username: string,
    image: string
){
 try {
    connectToDB();

    const updatedCommunity=await Community.findOneAndUpdate(
        {id:communityId},
         {name,username,image},
        );

        if(!updatedCommunity)
        {
            throw new Error("community not found");
        }

        return updatedCommunity;              
    } catch (error) {
        console.log(error)
    }
}

export async function deleteCommunity(communityId:string)
{
    try {
      connectToDB();
      
      const deletedCommunity=await Community.findOneAndDelete({id:communityId})

      if(!deleteCommunity)
      {
        throw new Error("Community not found")
      }
       

      //delete all the threads associated with the community

      await Thread.deleteMany({community:communityId});
      
      const communityUsers=await User.find({communities:communityId})
      
      const updateUserPromises=communityUsers.map((user)=>{
        user.communities.pull(communityId);
        return user.save();
      })

      await Promise.all(updateUserPromises);
      return deletedCommunity;

    } catch (error) {
        console.log(error)
    }
}