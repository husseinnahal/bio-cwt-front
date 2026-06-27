"use client"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function QuestionsSection() {
  const [form, setForm] = useState({ name: "", phone: "", question: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setForm({ name: "", phone: "", question: "" })
  }

  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-5 pb-16 md:pb-24 mt-10">
      {/* Mobile-only heading at the very top */}
      <h2 className="block font-heading text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-foreground mb-8  md:text-right">
        Any Questions?
      </h2>

      <div className="grid gap-10 md:grid-cols-2 md:gap-16 items-start jestify-center md:px-6">
        
        {/* Left Column: Form Inputs & Submit */}
        <form onSubmit={handleSubmit} className="space-y-4 order-2 md:order-1">
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            aria-label="Your name"
            className={`w-full  px-6 py-4 rounded-lg bg-input text-[#32353C] border-[2px] border-border  placeholder-[#D9D9D982] [&:not(:placeholder-shown)]:border-[#6C200B] [&:not(:placeholder-shown)]:bg-[#A3B8D7] outline-none transition duration-300`}
          />
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Your telephone number"
            aria-label="Your telephone number"
            className={`w-full  px-6 py-4 rounded-lg bg-input text-[#32353C] border-[2px] border-border  placeholder-[#D9D9D982] [&:not(:placeholder-shown)]:border-[#6C200B] [&:not(:placeholder-shown)]:bg-[#A3B8D7] outline-none transition duration-300`}
          />
          <textarea
            rows={5}
            required
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            placeholder="Your question"
            aria-label="Your question"
            className={`w-full  px-6 py-4 rounded-lg bg-input text-[#32353C] border-[2px] border-border  placeholder-[#D9D9D982] [&:not(:placeholder-shown)]:border-[#6C200B] [&:not(:placeholder-shown)]:bg-[#A3B8D7] outline-none transition duration-300`}
          />
          
          <div className="pt-2">
            <Button type="submit" className="rounded-full bg-primary hover:bg-secondary hover:text-secondary-foreground text-primary-foreground font-bold px-12 py-5 text-xs uppercase tracking-widest transition-colors duration-300 shadow-md">
              Send
            </Button>
          </div>

          {submitted && (
            <p className="mt-3 text-sm text-[#728BAD] font-semibold" role="status">
              Thank you! We will contact you soon.
            </p>
          )}
        </form>

        {/* Right Column: Heading (desktop), Description, and Cut Log Image */}
        <div className="space-y-6 order-1 md:order-2 flex flex-col md:items-end">          
          <p className="text-sm sm:text-lg md:text-xl leading-relaxed  text-foreground font-medium max-w-sm md:text-right">
            Write to us and we will be sure to answer all your questions and give you a comprehensive consultation.
          </p>

          {/* Styled circle tree logs image */}
          <div className="hidden md:block absolute  -bottom-[130px]   h-44 w-44 sm:h-[450px] sm:w-[450px] overflow-hidden rounded-full transition-transform duration-500 hover:rotate-6 mx-auto md:ml-0 z-10">
            <Image 
              src="/wood-question.png" 
              alt="Wooden log cross section" 
              fill 
              className="object-cover" 

            />
          </div>
        </div>

      </div>

    </section>
  )
}
