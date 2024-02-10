"use client"
import { PropsWithoutRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { commentSchema } from "@/lib/validations/validation"
import Image from "next/image"
import { createComment } from "@/lib/actions/thread.actions"
import { usePathname } from "next/navigation"



interface props {
    threadId: string,
    userImage: string,
    userId: string
}


const Comment = ({ threadId, userImage, userId }: props) => {



    const path=usePathname();
    const form = useForm<z.infer<typeof commentSchema>>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            thread: ""
        },
    })

   async function onSubmit(values: z.infer<typeof commentSchema>) {

      await createComment(JSON.parse(userId),threadId,values.thread,path) 
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex w-full items-center gap-3">
                            <FormLabel><Image src={userImage} alt='current user' width={48} height={48} className="rounded-full object-cover"></Image></FormLabel>
                            <FormControl className="border-none bg-transparent">
                                <Input type="text" placeholder="Comment..." {...field} className="no-focus text-light-1 outline-none" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Reply</Button>
            </form>
        </Form>
    )
}

export default Comment