import Image from "next/image"

interface props {
    accountId: string,
    authUserId: string,
    name: string,
    image: string,
    bio: string,
    username:string,
    type:"User"|"Community",
}

const ProfileHeader = ({ accountId, authUserId, name, image, bio, username,type }: props) => {
   
    return (

        <div className="flex w-full flex-col justify-start">
            <div className="flexx items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-20 w-20 object-cover">
                <Image  src={image} alt="Profile Image" fill className="rounded-full object-cover shadow-2x1"/>
                 </div>
                 <div className="flex-1">
                    <h2 className="text-left text-heading3-bold text-light-1">{name}</h2>
                    <p className="text-base-medium text-base-1">@{username}</p>
                 </div>
              </div>      
        </div>
        <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
              <div className="mt-12 h-0.5 w-full bg-dark-3"/>
        </div>
 
        )
}

export default ProfileHeader