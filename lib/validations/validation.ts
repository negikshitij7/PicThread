import { z } from "zod";

export const AccountProfileSchema = z.object({
  username: z.string().min(3).max(25),
  name: z.string().min(3).max(25),
  image: z.string(),
  bio: z.string().max(200),
});

export const threadSchema=z.object({
  thread:z.string().nonempty().min(3,{message:"Minimum 3 characters required"}),
  accountId:z.string()
})

export const commentSchema=z.object({
  thread:z.string().nonempty().min(3,{message:"Minimum 3 characters required"}),
})