import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { UserButton, currentUser } from "@clerk/nextjs";
import { resourceLimits } from "worker_threads";

const Home=async()=> {
  const result=await fetchPosts(1,30);
  
  const user=await currentUser()

  console.log(result)
  return (
  <>
    <h2 className="head-text text-left">Home</h2>
   
   <section className="mt-9 flex flex-col gap-10">
     {result?.posts.length===0 ? (<p className="no-result">No threads found</p>)
     :(
      <>
        
       {result?.posts.map((post)=>(

        <ThreadCard
         key={post._id}
         id={post._id}
         currentUserId={user?.id || ""}
         likes={post.likes}
         parentId={post.parentId}
         content={post.text}
         author={post.author}
         community={post.community}
         createdAt={post.createdAt}
         comments={post.children}
        />
       ))}

      </>
     )}
   </section>
  </>
  );
}


export default Home