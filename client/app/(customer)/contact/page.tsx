"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Clock, Globe } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { submitInquiry } from "@/shared/lib/api";

interface FAQItem {
  q: string;
  a: string;
}

const faqs: FAQItem[] = [
  {
    q: "Do you deliver across the United Arab Emirates?",
    a: "Yes, we offer reliable delivery services across all Emirates including Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah. Orders for standard items are usually dispatched within 24–48 hours.",
  },
  {
    q: "Can I request B2B bulk pricing for major projects?",
    a: "Absolutely. We are wholesale distributors specializing in high-volume supply for civil, mechanical, structural engineering, and fabrication projects. Contact our sales office directly at sales@alajer.com to obtain project-based discounts.",
  },
  {
    q: "Are your fasteners and structural products certified?",
    a: "Yes. All structural bolts, grade-eight fasteners, and safety gear supplied by AL AJER are fully certified. We can provide Mill Test Certificates (MTC) and compliance documentation upon request.",
  },
  {
    q: "What is your return and exchange policy?",
    a: "We have a 7-day return and exchange policy. Items must be unused, in their original packaging, and accompanied by the original invoice. Special custom-manufactured fasteners cannot be returned.",
  },
];

export default function ContactPage() {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Basic Validation
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      await submitInquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim() || null,
        message: message.trim(),
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070707] text-[#f5f5f5] font-sans pb-20">
      {/* 1. Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-[#0a0a0a] to-[#070707] border-b border-zinc-900/60 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <span className="text-[10px] tracking-[0.3em] font-extrabold text-gold uppercase mb-3 block">
            GET IN TOUCH
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white">
            CONTACT <span className="text-gold">AL AJER</span>
          </h1>
          <div className="w-16 h-1 bg-gold mx-auto mt-6 rounded-full"></div>
          <p className="mt-6 text-xs md:text-sm text-zinc-400 max-w-xl mx-auto uppercase tracking-wider leading-relaxed font-semibold">
            Have questions about products, bulk shipments, or technical specs? Get in touch with our dedicated trade sales desk.
          </p>
        </div>
      </section>

      {/* 2. Main Columns */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Premium Contact Form */}
          <div className="lg:col-span-7 bg-[#0c0c0c] border border-zinc-900 rounded-xl p-8 shadow-2xl relative">
            <div className="flex items-center gap-3.5 mb-8">
              <div className="h-4 w-1 bg-gold rounded-full"></div>
              <h2 className="text-base md:text-lg font-black tracking-widest uppercase text-white">
                SEND AN <span className="text-gold">ENQUIRY</span>
              </h2>
            </div>

            {success ? (
              <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-lg p-8 text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto" />
                <h3 className="text-sm font-extrabold uppercase text-white tracking-widest">Enquiry Sent Successfully</h3>
                <p className="text-zinc-400 text-xs max-w-sm mx-auto leading-relaxed">
                  Thank you for contacting AL AJER. One of our technical sales representatives will review your inquiry and get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 inline-block bg-[#161616] border border-zinc-800 text-[10px] font-extrabold uppercase tracking-widest text-gold hover:bg-gold hover:text-black py-2.5 px-6 rounded transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-950/25 border border-red-900/45 text-red-400 rounded p-3 text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label htmlFor="form-name" className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      Your Name <span className="text-gold">*</span>
                    </label>
                    <input
                      id="form-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-[#121212] border border-zinc-800 focus:border-gold outline-none px-4 py-3 rounded text-xs text-zinc-100 placeholder:text-zinc-600 transition-colors"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label htmlFor="form-email" className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      Email Address <span className="text-gold">*</span>
                    </label>
                    <input
                      id="form-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@company.com"
                      className="w-full bg-[#121212] border border-zinc-800 focus:border-gold outline-none px-4 py-3 rounded text-xs text-zinc-100 placeholder:text-zinc-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone Input */}
                  <div className="space-y-2">
                    <label htmlFor="form-phone" className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      Phone Number <span className="text-gold">*</span>
                    </label>
                    <input
                      id="form-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +971 55 883 0854"
                      className="w-full bg-[#121212] border border-zinc-800 focus:border-gold outline-none px-4 py-3 rounded text-xs text-zinc-100 placeholder:text-zinc-600 transition-colors"
                    />
                  </div>

                  {/* Subject Input */}
                  <div className="space-y-2">
                    <label htmlFor="form-subject" className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      Subject
                    </label>
                    <input
                      id="form-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Bulk fastener enquiry"
                      className="w-full bg-[#121212] border border-zinc-800 focus:border-gold outline-none px-4 py-3 rounded text-xs text-zinc-100 placeholder:text-zinc-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                  <label htmlFor="form-message" className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    Message Details <span className="text-gold">*</span>
                  </label>
                  <textarea
                    id="form-message"
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide specific sizes, grades, quantities, or product codes..."
                    className="w-full bg-[#121212] border border-zinc-800 focus:border-gold outline-none px-4 py-3 rounded text-xs text-zinc-100 placeholder:text-zinc-600 transition-colors resize-y min-h-[120px]"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold hover:bg-gold-hover disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-extrabold uppercase tracking-widest text-[10px] py-4 rounded transition-all active:scale-98 shadow-lg shadow-gold/15 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      SENDING MESSAGE...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5 stroke-[2.5]" />
                      SUBMIT ENQUIRY
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Office Info & FAQs */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick Contacts */}
            <div className="bg-[#0c0c0c] border border-zinc-900 rounded-xl p-8 shadow-2xl">
              <h3 className="text-sm font-extrabold uppercase text-white tracking-widest border-b border-zinc-900 pb-3 mb-6">
                OFFICE <span className="text-gold">CONTACTS</span>
              </h3>

              <div className="space-y-5 text-xs">
                {/* Main HQ Address */}
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold uppercase text-[9px] text-zinc-500 tracking-wider">Main Headquarters</p>
                    <p className="text-zinc-300 mt-1 leading-relaxed">
                      AL AJER Building Material Trading LLC,<br />
                      Al Quoz Industrial Area 4, Dubai, UAE
                    </p>
                  </div>
                </div>

                {/* Sales Hotlines */}
                <div className="flex gap-3">
                  <Phone className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold uppercase text-[9px] text-zinc-500 tracking-wider">Corporate Sales</p>
                    <p className="text-zinc-300 mt-1 font-bold">
                      <a href="tel:+971558830854" className="hover:text-gold mr-3">
                        +971 55 883 0854
                      </a>
                    </p>
                  </div>
                </div>

                {/* Corporate Emails */}
                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold uppercase text-[9px] text-zinc-500 tracking-wider">Email Inquiries</p>
                    <p className="text-zinc-300 mt-1">
                      General: <a href="mailto:info@alajer.com" className="hover:text-gold font-bold">info@alajer.com</a><br />
                      Sales Desk: <a href="mailto:sales@alajer.com" className="hover:text-gold font-bold">sales@alajer.com</a>
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold uppercase text-[9px] text-zinc-500 tracking-wider">Business Timings</p>
                    <p className="text-zinc-300 mt-1">
                      Mon - Sat: 8:00 AM - 8:00 PM<br />
                      Sunday: Closed (Holiday)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="bg-[#0c0c0c] border border-zinc-900 rounded-xl p-8 shadow-2xl">
              <h3 className="text-sm font-extrabold uppercase text-white tracking-widest border-b border-zinc-900 pb-3 mb-6">
                FREQUENTLY ASKED <span className="text-gold">QUESTIONS</span>
              </h3>

              <div className="space-y-4">
                {faqs.map((faq, i) => {
                  const isOpen = openFaqIndex === i;
                  return (
                    <div key={i} className="border-b border-zinc-900 pb-3 last:border-0 last:pb-0">
                      <button
                        onClick={() => toggleFaq(i)}
                        className="w-full text-left flex items-center justify-between gap-3 text-xs uppercase font-extrabold tracking-wider text-zinc-300 hover:text-gold transition-colors py-2 cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="h-4 w-4 text-gold shrink-0" /> : <ChevronDown className="h-4 w-4 text-zinc-600 shrink-0" />}
                      </button>

                      {isOpen && (
                        <p className="text-xs text-zinc-400 leading-relaxed mt-2 pl-1 animate-in fade-in slide-in-from-top-1 duration-200">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Embedded Google Map */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="border border-zinc-900 rounded-xl overflow-hidden h-[350px] relative shadow-inner bg-zinc-950">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14444.606277977463!2d55.2281862554199!3d25.16439055812903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6a27e8d35687%3A0xe54e6fa16b0807b!2sAl%20Quoz%20Industrial%20Area%204%20-%20Dubai!5e0!3m2!1sen!2sae!4v1784300000000!5m2!1sen!2sae"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) grayscale(100%) brightness(90%) contrast(110%)" }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="opacity-70 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </section>

      {/* 4. Floating WhatsApp Chat Widget */}
      <div className="fixed bottom-6 left-6 z-40 animate-bounce-short">
        <a
          href="https://wa.me/971558830854"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold uppercase tracking-widest text-[9px] px-4 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <MessageSquare className="h-4 w-4 fill-white" />
          <span>WHATSAPP SALES</span>
        </a>
      </div>
    </main>
  );
}
