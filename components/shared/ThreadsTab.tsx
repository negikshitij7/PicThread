import { fetchUserThreads } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface props{
    currentUserId:string,
    accountId:string,
    accountType:string
}
const ThreadsTab = async({currentUserId,
    accountId,
    accountType}:props) => {

    let result=accountType=="User"? (await fetchUserThreads(accountId)):(await fetchCommunityPosts(accountId));
    
    if(!result) redirect('/')

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map((post:any)=>(
           
           <ThreadCard
                    key={post._id}
                    id={post._id}
                    currentUserId={currentUserId}
                    likes={post.likes}
                    parentId={post.parentId}
                    content={post.text}
                    author={accountType === 'User'?
                ({name:result.name,image:result.image,id:result.id}):({name:post.author.name,image:post.author.image,id:post.author.id})}
                    community={post.community}
                    createdAt={post.createdAt}
                    comments={post.children}
                />
      ))}
    </section>
  )
}

export default ThreadsTab