import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="hidden md:block border-b border-zinc-900 bg-[#080808]">
      <div className="mx-auto max-w-7xl px-4 h-9 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 hover:text-gold transition-colors duration-200">
            <Phone className="h-3.5 w-3.5 text-gold" />
            055 883 0854
          </span>

          <span className="flex items-center gap-1.5 hover:text-gold transition-colors duration-200">
            <Mail className="h-3.5 w-3.5 text-gold" />
            alajerbmt@hotmail.com
          </span>

          <span className="flex items-center gap-1.5 hover:text-gold transition-colors duration-200">
            <MapPin className="h-3.5 w-3.5 text-gold" />
            Al Quoz, Dubai, UAE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-gold transition-colors duration-200"
          >
            <FaFacebookF className="h-3.5 w-3.5" />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-gold transition-colors duration-200"
          >
            <FaInstagram className="h-3.5 w-3.5" />
          </a>

          <a
            href="https://wa.me/971558830854"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="hover:text-gold transition-colors duration-200"
          >
            <FaWhatsapp className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}