"use client"
import React, { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AccountProfileSchema } from '../../lib/validations/validation'
import { Textarea } from '../ui/textarea'
import Image from 'next/image'
import { isBase64Image } from '@/lib/utils'
import { useUploadThing } from '@/lib/uploadthing'
import { updateUser } from '@/lib/actions/user.actions'
import { usePathname, useRouter } from 'next/navigation'


interface Props{
 
 user:{   
  userId:string,
  objectId:string,
  image:string,
  username:string,
  name:string,
  bio:string,
 };
 btnTitle:string;
}


const AccountProfile = ({user,btnTitle}:Props) => {
   
  const path=usePathname();
  const router=useRouter(); 
   
   const [files,setFiles]=useState<File[]>([])
   const {startUpload}=useUploadThing("media") 


    const form = useForm<z.infer<typeof AccountProfileSchema>>({
        resolver: zodResolver(AccountProfileSchema),
        defaultValues: {
            image: user?.image ? user.image : "",
            name: user?.name ? user.name : "",
            username: user?.username ? user.username : "",
            bio: user?.bio ? user.bio : "",
        },
      })
 

      const handleImage = (
        e: ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void
      ) => {
        e.preventDefault();
    
        const fileReader = new FileReader();
    
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          setFiles(Array.from(e.target.files));
    
          if (!file.type.includes("image")) return;
    
          fileReader.onload = async (event) => {
            const imageDataUrl = event.target?.result?.toString() || "";
            fieldChange(imageDataUrl);
          };
    
          fileReader.readAsDataURL(file);
        }
      };
      
      const onSubmit= async (values: z.infer<typeof AccountProfileSchema>)=> {
       
       const blob=values.image;

       const hasImageChanged=isBase64Image(blob)  // Function created by chat gpt to check whether the image is new or not
        
        if(hasImageChanged)
        {
          const imgRes=await startUpload(files)
         
          if(imgRes && imgRes[0].url)
            {
              values.image=imgRes[0].url;
            }
        }
        
      await updateUser({
        username:values.username,
        name:values.name,
        path:path,
        image:values.image,
        bio:values.bio,
        userId:user.userId
      })
     
    if(path ==="/profile/edit")
        {
          router.back()
        }
        else{
          router.push('/')
        }
      }

    return (
       
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start  gap-10 ">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className='flex items-center ga-4'>
                <FormLabel className='account-form_image-label'>
                {field.value? 
                (<Image src={field.value} alt="profile photo" priority className='rounded-full object-contain' width={96} height={96}/>)
                :(<Image src='/assets/icons/profile-placeholder.svg' alt="profile photo"  className='rounded-full object-contain'width={28} height={28}/>)
                }
                 </FormLabel>
                <FormControl className="flex-1 text-base-semibold text-gray-200">
                  <Input type="file" accept='image/*' placeholder="shadcn"  onChange={(e)=>handleImage(e,field.onChange)} className="account-form_image-input"/>
                </FormControl>
               
            
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='text-white'>Username</FormLabel>
                <FormControl>
                  <Input type='text' {...field} className="account-form_input no-focus"/>
                </FormControl>
              
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-white'>Name</FormLabel>
                <FormControl>
                  <Input placeholder={""} {...field} className="account-form_input"/>
                </FormControl>
            
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-white'>Bio</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={10} className="account-form_input"/>
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
  )
}

export default AccountProfile