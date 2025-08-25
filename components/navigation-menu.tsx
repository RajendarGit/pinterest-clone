import Link from "next/link";
const NavigationMenu = () => {
  return (
    <nav className="hidden md:flex items-center space-x-8 ml-8">
      <Link href="/" className="text-foreground hover:text-primary font-medium">
        Home
      </Link>
      <Link
        href="/following"
        className="text-muted-foreground hover:text-primary font-medium"
      >
        Following
      </Link>
      <Link
        href="/people"
        className="text-muted-foreground hover:text-primary font-medium"
      >
        People
      </Link>
      <Link
        href="/create"
        className="text-muted-foreground hover:text-primary font-medium"
      >
        Create
      </Link>
      <Link
        href="/boards"
        className="text-muted-foreground hover:text-primary font-medium"
      >
        Boards
      </Link>
    </nav>
  );
};

export default NavigationMenu;
