import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="hidden md:block border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 h-9 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            055 883 0854
          </span>

          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            alajerbmt@hotmail.com
          </span>

          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Dubai, UAE
          </span>
        </div>

        <div className="flex items-center gap-5">
          <Link href="/account" className="hover:text-primary">
            Track Order
          </Link>

          <Link href="/stores" className="hover:text-primary">
            Store Locator
          </Link>

          <Link href="/contact" className="hover:text-primary">
            Contact Us
          </Link>

          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-primary"
            >
              <FaFacebookF className="h-3.5 w-3.5" />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-primary"
            >
              <FaInstagram className="h-3.5 w-3.5" />
            </a>

            <a
              href="https://wa.me/971558830854"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hover:text-primary"
            >
              <FaWhatsapp className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}