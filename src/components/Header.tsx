import { Search, Menu, X, User, LogOut, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { usePendingOrders } from "@/hooks/usePendingOrders";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { pendingCount } = usePendingOrders();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"
        }`}
    >
      <div className={`mx-4 md:mx-8 rounded-2xl transition-all duration-300 ${scrolled ? "glass-panel shadow-lg bg-[#0f172a]/90 backdrop-blur-md border-white/10" : "bg-[#0f172a] border border-white/5"
        }`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20"
            >
              CA
            </motion.div>
            <div className="hidden sm:block">
              <div className="font-heading font-bold text-xl leading-none tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                COURSE
              </div>
              <div className="font-heading font-bold text-xl leading-none tracking-tight text-gradient">
                ALBUM
              </div>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative group">
              <Input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-4 pr-12 py-6 bg-white border-white/10 text-gray-900 placeholder:text-gray-500 rounded-xl focus:bg-white focus:border-emerald-500/50 transition-all"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 hover:bg-emerald-500/20 hover:text-emerald-400 text-gray-400 transition-all rounded-lg"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10 hover:text-emerald-400 rounded-xl"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Auth Buttons */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                {isAdmin && (
                  <Button variant="ghost" size="sm" asChild className="gap-2 text-white hover:bg-white/10 rounded-lg">
                    <Link to="/admin">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      Admin
                      {pendingCount > 0 && (
                        <Badge className="ml-1 bg-red-500 text-white border-0">
                          {pendingCount}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild className="gap-2 text-white hover:bg-white/10 rounded-lg">
                  <Link to="/my-account">
                    <User className="w-4 h-4 text-cyan-400" />
                    Account
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="text-white hover:bg-red-500/20 hover:text-red-400 rounded-lg"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button asChild className="hidden sm:inline-flex gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-white border-0 shadow-lg shadow-emerald-500/20 rounded-xl">
                <Link to="/admin-login">
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10 rounded-xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden px-4 pb-4 overflow-hidden"
            >
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-4 pr-12 bg-white border-white/10 text-gray-900 rounded-xl"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <AnimatePresence>
        {(scrolled || !scrolled) && ( // Always show nav, but style differently based on scroll if needed
          <nav className="container mx-auto px-4 mt-2">
            {/* Desktop Nav */}
            <ul className="hidden lg:flex items-center justify-center gap-1 p-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors group"
                  >
                    {link.label}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Nav */}
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="lg:hidden absolute top-full left-4 right-4 mt-2 p-4 rounded-2xl glass-panel bg-[#0f172a]/95 border-white/10 z-50 shadow-2xl"
              >
                <ul className="space-y-1">
                  {navLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  {user ? (
                    <>
                      <div className="h-px bg-white/10 my-2" />
                      {isAdmin && (
                        <li>
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 rounded-xl"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Shield className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        </li>
                      )}
                      <li>
                        <button
                          onClick={() => {
                            handleSignOut();
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <div className="h-px bg-white/10 my-2" />
                      <li>
                        <Link
                          to="/admin-login"
                          className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl shadow-lg shadow-emerald-500/20"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Shield className="w-4 h-4" />
                          Admin Login
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </motion.div>
            )}
          </nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
