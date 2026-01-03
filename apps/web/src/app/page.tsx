import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex justify-between items-center">
          <Link href="/" className="text-lg font-semibold">
            StudyMate
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="#features" className="text-sm text-neutral-600 hover:text-black transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-neutral-600 hover:text-black transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-sm text-neutral-600 hover:text-black transition-colors">
              Sign in
            </Link>
            <Link href="/register">
              <Button size="sm" className="rounded-full px-4">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-black mb-6 text-balance">
            AI tutoring that adapts to your child
          </h1>
          <p className="text-xl text-neutral-500 mb-10 max-w-2xl mx-auto text-balance">
            Personalised learning for Australian students from Prep to Year 12.
            Instant feedback, adaptive difficulty, and explanations that make sense.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="rounded-full px-8 h-12 text-base">
                Start free trial
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base">
                Learn more
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-6 border-y border-neutral-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm text-neutral-400 mb-6">
            Trusted by families across Australia
          </p>
          <div className="flex justify-center items-center gap-12 text-neutral-300">
            <span className="text-2xl font-semibold">1,000+</span>
            <span className="text-sm text-neutral-400">Students learning</span>
            <span className="w-px h-6 bg-neutral-200" />
            <span className="text-2xl font-semibold">50,000+</span>
            <span className="text-sm text-neutral-400">Questions answered</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Everything your child needs to succeed
            </h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
              Built from the ground up for Australian students, with features that actually help them learn.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Adaptive Learning',
                description: 'Questions automatically adjust to match your child\'s ability. No more too-easy or too-hard problems.',
              },
              {
                title: 'AI Explanations',
                description: 'Stuck on a problem? Get clear, step-by-step explanations tailored to how your child learns best.',
              },
              {
                title: 'Progress Tracking',
                description: 'See exactly where your child excels and where they need more practice. Real data, not guesswork.',
              },
              {
                title: 'Australian Curriculum',
                description: 'Aligned with what Australian schools teach. From Prep to Year 12, Maths and English.',
              },
              {
                title: 'Engaging Experience',
                description: 'Points, streaks, and achievements keep kids motivated. Learning that doesn\'t feel like homework.',
              },
              {
                title: 'Parent Dashboard',
                description: 'Stay informed with clear reports. Know what your child is learning and how they\'re progressing.',
              },
            ].map((feature) => (
              <div key={feature.title} className="p-6">
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-neutral-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16">
            Get started in minutes
          </h2>
          <div className="space-y-12">
            {[
              { step: '01', title: 'Create your account', description: 'Sign up free and add your children\'s profiles. No credit card required.' },
              { step: '02', title: 'Take the benchmark test', description: 'A quick assessment finds exactly where your child is at in each subject.' },
              { step: '03', title: 'Start learning', description: 'Your child gets personalised questions at just the right difficulty level.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-8 items-start">
                <span className="text-4xl font-light text-neutral-300">{item.step}</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-neutral-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-neutral-500">
              Start free. Upgrade when you need more.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="border border-neutral-200 rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-1">Explorer</h3>
              <p className="text-sm text-neutral-500 mb-6">For trying things out</p>
              <div className="mb-6">
                <span className="text-4xl font-semibold">$0</span>
                <span className="text-neutral-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  2 child profiles
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  20 questions per day
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  10 AI explanations per day
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  Progress tracking
                </li>
              </ul>
              <Link href="/register" className="block">
                <Button variant="outline" className="w-full rounded-full">
                  Get started
                </Button>
              </Link>
            </div>

            {/* Scholar */}
            <div className="border-2 border-black rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-6 bg-black text-white text-xs px-3 py-1 rounded-full">
                Most popular
              </div>
              <h3 className="text-lg font-semibold mb-1">Scholar</h3>
              <p className="text-sm text-neutral-500 mb-6">For dedicated learners</p>
              <div className="mb-6">
                <span className="text-4xl font-semibold">$5</span>
                <span className="text-neutral-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  5 child profiles
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  Unlimited questions
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  Unlimited AI explanations
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  All subjects
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  Ad-free experience
                </li>
              </ul>
              <Link href="/register?plan=scholar" className="block">
                <Button className="w-full rounded-full">
                  Start free trial
                </Button>
              </Link>
            </div>

            {/* Achiever */}
            <div className="border border-neutral-200 rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-1">Achiever</h3>
              <p className="text-sm text-neutral-500 mb-6">For serious students</p>
              <div className="mb-6">
                <span className="text-4xl font-semibold">$12</span>
                <span className="text-neutral-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  10 child profiles
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  Everything in Scholar
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  Term reports (PDF)
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  Curriculum mapping
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  Priority support
                </li>
              </ul>
              <Link href="/register?plan=achiever" className="block">
                <Button variant="outline" className="w-full rounded-full">
                  Start free trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Ready to transform how your child learns?
          </h2>
          <p className="text-lg text-neutral-400 mb-8">
            Join thousands of Australian families already using StudyMate.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="rounded-full px-8 h-12 text-base">
              Get started free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-neutral-100 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">StudyMate</h3>
              <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
                AI-powered tutoring for Australian students. Personalised learning
                aligned with the Australian curriculum from Prep to Year 12.
              </p>
              <div className="text-sm text-neutral-500 space-y-1">
                <p><strong>Enhanced Software Systems</strong></p>
                <p>A product of SOFTSYS PTY LTD</p>
                <p>ABN: 64 663 472 759</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><Link href="#features" className="hover:text-black transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-black transition-colors">Pricing</Link></li>
                <li><Link href="/login" className="hover:text-black transition-colors">Sign In</Link></li>
                <li><Link href="/register" className="hover:text-black transition-colors">Get Started</Link></li>
              </ul>
            </div>

            {/* Contact & Legal */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
                <li><Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund" className="hover:text-black transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact Details */}
          <div className="border-t border-neutral-200 pt-8 mb-8">
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-neutral-600">
              <div>
                <p className="font-medium text-black mb-1">Email</p>
                <a href="mailto:tendai@agentsform.ai" className="hover:text-black transition-colors">
                  tendai@agentsform.ai
                </a>
              </div>
              <div>
                <p className="font-medium text-black mb-1">Phone</p>
                <a href="tel:+61410386167" className="hover:text-black transition-colors">
                  +61 410 386 167
                </a>
              </div>
              <div>
                <p className="font-medium text-black mb-1">Location</p>
                <p>Melbourne, Australia</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-neutral-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-neutral-500">
              © 2026 SOFTSYS PTY LTD trading as Enhanced Software Systems. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-neutral-500">
              <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
              <Link href="/refund" className="hover:text-black transition-colors">Refunds</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
