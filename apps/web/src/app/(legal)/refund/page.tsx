import Link from 'next/link'

export default function RefundPage() {
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
        <h1 className="text-4xl font-semibold mb-8">Refund Policy</h1>
        <p className="text-sm text-neutral-500 mb-8">Last updated: January 2026</p>

        <div className="prose prose-neutral max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Our Commitment</h2>
            <p className="text-neutral-600 mb-4">
              At StudyMate, operated by SOFTSYS PTY LTD (ABN 64 663 472 759), we want you to be
              completely satisfied with our service. If you&apos;re not happy, we&apos;re here to help.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Free Trial</h2>
            <p className="text-neutral-600 mb-4">
              We offer a free Explorer plan so you can try StudyMate before committing to a
              paid subscription. We encourage you to fully explore the platform before upgrading.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Subscription Refunds</h2>
            <p className="text-neutral-600 mb-4">
              For paid subscriptions (Scholar and Achiever plans):
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
              <li><strong>Within 7 days:</strong> Full refund, no questions asked</li>
              <li><strong>After 7 days:</strong> Pro-rata refund at our discretion based on usage</li>
              <li><strong>Technical issues:</strong> Full refund if we cannot resolve platform issues affecting your use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">How to Request a Refund</h2>
            <p className="text-neutral-600 mb-4">
              To request a refund:
            </p>
            <ol className="list-decimal pl-6 text-neutral-600 mb-4 space-y-2">
              <li>Email us at <a href="mailto:tendai@agentsform.ai" className="text-black underline">tendai@agentsform.ai</a></li>
              <li>Include your account email and reason for the refund request</li>
              <li>We will respond within 2 business days</li>
              <li>Approved refunds are processed within 5-10 business days</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Cancellation</h2>
            <p className="text-neutral-600 mb-4">
              You can cancel your subscription at any time:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
              <li>Go to your Dashboard and click &quot;Manage Subscription&quot;</li>
              <li>Or contact us at <a href="mailto:tendai@agentsform.ai" className="text-black underline">tendai@agentsform.ai</a></li>
            </ul>
            <p className="text-neutral-600 mb-4">
              Upon cancellation, you retain access to paid features until the end of your
              current billing period. Your account will then revert to the free Explorer plan.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Disputes</h2>
            <p className="text-neutral-600 mb-4">
              If you have a dispute about a charge:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
              <li>Contact us first - we want to resolve issues directly</li>
              <li>We will investigate and respond within 5 business days</li>
              <li>If we cannot resolve the issue, you may escalate to your payment provider</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Exceptions</h2>
            <p className="text-neutral-600 mb-4">
              Refunds may not be available in cases of:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
              <li>Violation of our Terms of Service</li>
              <li>Account termination due to abuse or fraud</li>
              <li>Chargebacks initiated without contacting us first</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="text-neutral-600 mb-4">
              For refund requests or billing questions:
            </p>
            <div className="text-neutral-600 space-y-1">
              <p><strong>SOFTSYS PTY LTD</strong></p>
              <p>Trading as Enhanced Software Systems</p>
              <p>ABN: 64 663 472 759</p>
              <p>17 Koomba Crescent, Greenvale VIC 3059, Australia</p>
              <p>Email: <a href="mailto:tendai@agentsform.ai" className="text-black underline">tendai@agentsform.ai</a></p>
              <p>Phone: <a href="tel:+61410386167" className="text-black underline">+61 410 386 167</a></p>
            </div>
          </section>

          <section className="mb-8 p-6 bg-neutral-50 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Australian Consumer Law</h2>
            <p className="text-neutral-600">
              Nothing in this policy limits your rights under Australian Consumer Law.
              If our services have a major problem, you are entitled to cancel and receive
              a refund. If the problem is minor, we will fix it within a reasonable time.
            </p>
          </section>
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
