import CommunityCard from "@/components/cards/CommunityCard";
import UserCard from "@/components/shared/UserCard";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async() => {
  const user=await currentUser();
  
  if(!user) return null

  const userInfo=await fetchUser(user.id);

  if(!userInfo.onboarded)
  {
    redirect('/onboarding')
  }
 
  //Fetch Users
  
  const result= await fetchCommunities({searchString:'',pageNumber:1,pageSize:25});

  return (
    <section>
        <h1 className="head-text mb-10">Search</h1>
       {/* Search Bar */}
         
         <div className="mt-14 flex flex-col gap-9">
             {result?.communities.length ===0 ? (
                <p className="no-result">No Users</p>
             ):
             (
              <>
               {result?.communities.map((community)=>(
                 <CommunityCard key={community.id} id={community.id} name={community.name} bio={community.bio} username={community.username} image={community.image} members={community.members} />
               ))}
              </>
             ) } 
         </div>


    </section>
  )
}

export default page