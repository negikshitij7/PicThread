"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { threadSchema } from "@/lib/validations/validation"
import { Textarea } from "../ui/textarea"
import { usePathname, useRouter } from "next/navigation"
import { createThread } from "@/lib/actions/thread.actions"
import { useOrganization } from "@clerk/nextjs"
 
interface param{
    userId:string;
}

const PostForm = ({userId}:param) => {
    const {organization}= useOrganization();
    const path=usePathname();
    const router=useRouter();

     const form = useForm<z.infer<typeof threadSchema>>({
        resolver: zodResolver(threadSchema),
        defaultValues: {
         thread:"",
         accountId:userId,
        },
      })

      const onSubmit=async(values: z.infer<typeof threadSchema>)=> {
       await createThread({
        text:values.thread,
        author:userId,
        communityId:organization?organization.id : null,
        path:path

       })

     router.push("/")

      }
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
        control={form.control}
        name="thread"
        render={({ field }) => (
          <FormItem >
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Textarea rows={8} placeholder="Create your thread here" {...field} className='bg-dark-2 border border-dark-4 text-white'/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="hover:bg-slate-800">Post Thread</Button>
    </form>
  </Form>
  )
}

export default PostForm