"use client"

import { updateLikes } from '@/lib/actions/thread.actions';
import { formatDateString } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'

interface props {
    id: string,
    currentUserId: string,
    likes:[string],
    parentId: string | null,
    content: string,
    author: {
        name: string,
        image: string,
        id: string
    },
    community:{
        id:string;
        name:string;
        image:string;
    } | null,
    createdAt: string,
    comments: { author: { image: string } }[]
    isComment?: boolean;

}


const ThreadCard = ({
    id,
    currentUserId,
    likes,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments,
    isComment
}: props) => {

    const [likesArray,setLikesArray]=useState(likes);
    const [isLiked,setisLiked]=useState(likesArray.includes(currentUserId));
    
    const handleLikes=async(e:any)=>{
          e.preventDefault()
        
        if(isLiked)
        {
            let newlikesArray={...likesArray};
            newlikesArray.filter((id)=>currentUserId!=id)          
            setLikesArray(newlikesArray);
            setisLiked(false)
            await updateLikes(id,newlikesArray);
        } 
        else{
            let newlikesArray={...likesArray,currentUserId};
            setLikesArray(newlikesArray);
            setisLiked(true);
            await updateLikes(id,newlikesArray);                      
        } 
  

    }


    return (

        <article className={`flex w-full flex-col rounded-xl p-7 ${isComment? ('px-0 xs:px-7'):('bg-dark-2')}`}>

            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">

                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`}>
                            <Image
                                src={author.image}
                                alt='profile image'
                                fill
                                className='cursor-pointer rounded-full'
                            />

                        </Link>

                        <div className="thread-card_bar" />

                    </div>

                    <div className="flex w-full flex-col">
                        <Link href={`profile/${author.id}`} className='w-fit'>
                            <h4 className='cursor-pointer text-base-semibold text-light-1'>{author.name}</h4>
                        </Link>
                        <h2 className='mt-4 text-small-regular text-light-2'>
                            {content}
                        </h2>
                        
                        <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
                            <div className="flex gap-3.5">
                               <Image src={isLiked?("/assets/icons/like.svg"):("/assets/icons/liked.svg")} alt="like" className="cursor-pointer object-contain" width={24} height={24} onClick={handleLikes}/>  

                               <Link href={`thread/${id}`}>
                               <Image src="/assets/icons/reply.svg" alt="reply" className="cursor-pointer object-contain" width={24} height={24}/>  
                                </Link>  
                                 
                               <Image src="/assets/icons/repost.svg" alt="repost" className="cursor-pointer object-contain" width={24} height={24}/>    
                               <Image src="/assets/icons/share.svg" alt="share" className="cursor-pointer object-contain" width={24} height={24}/>    
                                 
                           </div>

                           {isComment && comments.length>0 &&(
                             <Link href={`/thread/${id}`}>
                                <p className='mt-1 text-subtle-medium text-grey-1'>{comments.length}</p>
                             </Link>

                           )} 

                        </div>

                    </div>
               </div>

               {!isComment && community && (
                 <Link href={`/communities/${community.id}`} className="mt-5 flex items-center">
                   <p className='text-subtle-medium'>{formatDateString(createdAt)} {" "}-{community.name} Community</p>

                   <Image src={community.image} alt={community.name} width={14} height={14} className='ml-1 rounded-full object-hover'/>
                 </Link>

               )}
            </div>
             
        </article>

    )
}

export default ThreadCard