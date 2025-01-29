import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileImageProps {
  username: string;
  image?: string;
  classname?: string;
}
const ProfileImage = ({ username, image, classname }: ProfileImageProps) => {
  return (
    <Avatar className={cn("w-8 h-8", classname)}>
      <AvatarImage src={image} className="object-cover" />
      <AvatarFallback className="capitalize">{username[0] || "ET"}</AvatarFallback>
    </Avatar>
  );
};

export default ProfileImage;
