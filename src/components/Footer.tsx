import { Facebook, Instagram, Twitter, Mail, Phone, MoveRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="relative bg-[#050a14] text-white border-t border-white/5 pt-20 pb-10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-emerald-900/10 to-transparent pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform duration-500">
                CA
              </div>
              <div>
                <span className="font-heading font-bold text-xl tracking-tight text-white block leading-none">COURSE</span>
                <span className="font-heading font-bold text-xl tracking-tight text-gradient block leading-none">ALBUM</span>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Empowering learners worldwide with premium educational content at accessible prices. Join our community of achievers today.
            </p>
            <div className="flex items-center gap-4">
              <SocialLink icon={<Twitter className="w-5 h-5" />} href="https://twitter.com/Coursealbum" />
              <SocialLink icon={<Instagram className="w-5 h-5" />} href="#" />
              <SocialLink icon={<Facebook className="w-5 h-5" />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg text-white mb-6">Explore</h4>
            <ul className="space-y-3 text-gray-400">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/courses" label="All Courses" />
              <FooterLink to="/my-account" label="My Account" />
              <FooterLink to="#" label="Become an Instructor" />
            </ul>
          </div>

          {/* Legal/Support */}
          <div>
            <h4 className="font-heading font-bold text-lg text-white mb-6">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <FooterLink to="#" label="Help Center" />
              <FooterLink to="#" label="Terms of Service" />
              <FooterLink to="#" label="Privacy Policy" />
              <FooterLink to="#" label="Refund Policy" />
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading font-bold text-lg text-white mb-6">Stay Updated</h4>
            <p className="text-gray-400 mb-4 text-sm">
              Subscribe to get the latest course updates and exclusive offers.
            </p>
            <div className="relative group">
              <Input
                placeholder="Enter your email"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-10 pr-10 rounded-lg focus:bg-white/10 transition-all border-none ring-1 ring-white/10 focus:ring-emerald-500/50"
              />
              <Button
                size="icon"
                className="absolute right-0 top-0 h-10 w-10 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition-opacity border-0"
              >
                <MoveRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Coursealbum. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span>for learners</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ icon, href }: { icon: React.ReactNode, href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-emerald-500/20 hover:scale-110 transition-all duration-300 border border-white/5 hover:border-emerald-500/30"
  >
    {icon}
  </a>
);

const FooterLink = ({ to, label }: { to: string, label: string }) => (
  <li>
    <Link
      to={to}
      className="hover:text-emerald-400 transition-colors flex items-center gap-2 group"
    >
      <span className="w-1 h-1 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      {label}
    </Link>
  </li>
);

export default Footer;
