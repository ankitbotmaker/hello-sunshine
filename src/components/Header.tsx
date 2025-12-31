import { Search, Menu, X, User, LogOut, Shield } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import CartDrawer from "@/components/CartDrawer";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
    navigate('/');
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "My account", href: "/my-account" },
    { label: "Request Course", href: "#" },
    { label: "Exchange Courses", href: "#" },
    { label: "How To Download Course", href: "#" },
    { label: "Contact us", href: "#" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Top Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              TCG
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg leading-tight">THE COURSE</div>
              <div className="font-bold text-lg leading-tight text-primary">GALLERY</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search"
                className="w-full pr-12 bg-muted border-border"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 hover:bg-primary hover:text-primary-foreground"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Auth Buttons */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                {isAdmin && (
                  <Button variant="default" size="sm" asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
                    <Link to="/admin">
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild className="gap-2">
                  <Link to="/my-account">
                    <User className="w-4 h-4" />
                    Account
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign Out">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button variant="default" size="sm" asChild className="hidden sm:inline-flex">
                <Link to="/auth">Login / Register</Link>
              </Button>
            )}
            
            <div className="flex items-center gap-2">
              <span className="font-medium hidden sm:inline">${totalPrice.toFixed(2)}</span>
              <CartDrawer />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden px-4 pb-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search"
                className="w-full pr-12 bg-muted border-border"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="bg-nav text-nav-foreground">
        <div className="container mx-auto px-4">
          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="flex items-center gap-1 px-4 py-4 text-sm font-medium hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Nav */}
          {isMenuOpen && (
            <ul className="lg:hidden py-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-nav-foreground/10 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {/* Mobile Auth */}
              {user ? (
                <>
                  {isAdmin && (
                    <li>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-nav-foreground/10 rounded-lg transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium hover:bg-nav-foreground/10 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to="/auth"
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Login / Register
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
