import Link from "next/link";
import { Hammer, Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-[#060606] text-zinc-400 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="h-10 w-10 rounded-full border border-gold flex items-center justify-center flex-shrink-0">
                <Hammer className="h-4.5 w-4.5 text-gold" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold tracking-wider text-gold">
                  AL AJER
                </span>
                <span className="text-[8px] tracking-widest text-zinc-500 uppercase font-medium">
                  Building Material Trading LLC
                </span>
              </div>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed mb-6">
              One of the leading suppliers of hardware, construction materials, industrial equipment, power tools, safety products, electrical supplies, and engineering solutions in the United Arab Emirates.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-gold hover:bg-zinc-800 transition-all duration-200" aria-label="Facebook">
                <FaFacebookF className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-gold hover:bg-zinc-800 transition-all duration-200" aria-label="Instagram">
                <FaInstagram className="h-4 w-4" />
              </a>
              <a href="https://wa.me/971558830854" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-gold hover:bg-zinc-800 transition-all duration-200" aria-label="WhatsApp">
                <FaWhatsapp className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-gold transition-colors">About Us</Link></li>
              <li><Link href="/stores" className="hover:text-gold transition-colors">Our Stores</Link></li>
              <li><Link href="/projects" className="hover:text-gold transition-colors">Projects</Link></li>
              <li><Link href="/careers" className="hover:text-gold transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Customer Service Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
              <li><Link href="/account" className="hover:text-gold transition-colors">Track Order</Link></li>
              <li><Link href="/returns" className="hover:text-gold transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/faq" className="hover:text-gold transition-colors">FAQs</Link></li>
              <li><Link href="/blog" className="hover:text-gold transition-colors">Blog & News</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Contact Info
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span className="text-zinc-300">055 883 0854</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span className="text-zinc-300 break-all">alajerbmt@hotmail.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span className="text-zinc-300">Al Quoz Industrial Area 3, Dubai, UAE</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-900 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} AL AJER Building Material Trading LLC. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gold">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}