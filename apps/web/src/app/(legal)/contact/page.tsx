import Link from 'next/link'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex justify-between items-center">
          <Link href="/" className="text-lg font-semibold">
            StudyMate
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-semibold mb-4">Contact Us</h1>
        <p className="text-lg text-neutral-500 mb-12">
          We&apos;re here to help. Reach out to us using any of the methods below.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 bg-neutral-50 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Email Support</h2>
            <p className="text-neutral-600 mb-4">
              For general inquiries, technical support, or billing questions:
            </p>
            <a
              href="mailto:support@agentsform.ai"
              className="text-lg font-medium text-black hover:underline"
            >
              support@agentsform.ai
            </a>
            <p className="text-sm text-neutral-500 mt-2">
              We typically respond within 24 hours on business days.
            </p>
          </div>

          <div className="p-6 bg-neutral-50 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Phone Support</h2>
            <p className="text-neutral-600 mb-4">
              For urgent matters or if you prefer to speak with us:
            </p>
            <a
              href="tel:+61410386167"
              className="text-lg font-medium text-black hover:underline"
            >
              +61 410 386 167
            </a>
            <p className="text-sm text-neutral-500 mt-2">
              Available Monday to Friday, 9am - 5pm AEST.
            </p>
          </div>
        </div>

        <div className="p-8 border border-neutral-200 rounded-xl mb-12">
          <h2 className="text-xl font-semibold mb-6">Business Address</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium mb-2">Registered Business</h3>
              <div className="text-neutral-600 space-y-1">
                <p><strong>SOFTSYS PTY LTD</strong></p>
                <p>Trading as Enhanced Software Systems</p>
                <p>ABN: 64 663 472 759</p>
                <p>ACN: 663 472 759</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Postal Address</h3>
              <div className="text-neutral-600 space-y-1">
                <p>17 Koomba Crescent</p>
                <p>Greenvale VIC 3059</p>
                <p>Australia</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="p-6 bg-neutral-50 rounded-xl">
              <h3 className="font-semibold mb-2">How do I reset my password?</h3>
              <p className="text-neutral-600">
                Click &quot;Forgot password&quot; on the login page and enter your email.
                You&apos;ll receive a verification code to reset your password.
              </p>
            </div>
            <div className="p-6 bg-neutral-50 rounded-xl">
              <h3 className="font-semibold mb-2">How do I cancel my subscription?</h3>
              <p className="text-neutral-600">
                Go to your Dashboard, click the &quot;Manage Subscription&quot; button,
                and follow the prompts in the Stripe portal. You can also email us.
              </p>
            </div>
            <div className="p-6 bg-neutral-50 rounded-xl">
              <h3 className="font-semibold mb-2">How do I add another child?</h3>
              <p className="text-neutral-600">
                From your Dashboard, click &quot;Add Child&quot; and fill in their details.
                The number of children you can add depends on your subscription plan.
              </p>
            </div>
            <div className="p-6 bg-neutral-50 rounded-xl">
              <h3 className="font-semibold mb-2">Is my child&apos;s data safe?</h3>
              <p className="text-neutral-600">
                Yes. We take privacy seriously and comply with Australian Privacy Principles.
                Read our <Link href="/privacy" className="underline">Privacy Policy</Link> for details.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-black text-white rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Need Help Getting Started?</h2>
          <p className="text-neutral-300 mb-6">
            New to StudyMate? We&apos;re happy to walk you through the platform
            and help you set up your children&apos;s profiles.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-neutral-100 transition-colors"
          >
            Create Free Account
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200">
          <Link href="/" className="text-sm text-neutral-500 hover:text-black transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
