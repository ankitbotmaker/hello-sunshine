import { MessageCircle, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-nav text-nav-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                TCG
              </div>
              <div>
                <div className="font-bold leading-tight">THE COURSE</div>
                <div className="font-bold leading-tight text-primary">GALLERY</div>
              </div>
            </div>
            <p className="text-sm text-nav-foreground/70 mb-4">
              Your #1 source for premium courses at affordable prices. Learn from the best instructors worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-nav-foreground/70">
              <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shop</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">My Account</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cart</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Request Course</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-nav-foreground/70">
              <li><a href="#" className="hover:text-primary transition-colors">Stock Market</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Forex Courses</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Digital Marketing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Option Trading</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Price Action</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-nav-foreground/70">
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span>support@thecoursegallery.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>Available 24/7</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-nav-foreground/10">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-nav-foreground/50">
            © 2025 The Course Gallery. All rights reserved.
          </p>
        </div>
      </div>

      {/* Floating Contact Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group">
          <MessageCircle className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
            Contact us
          </span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
