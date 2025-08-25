import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image src="/logo.png" alt="PinClone" width={100} height={40} />
    </Link>
  );
};

export default Logo;
