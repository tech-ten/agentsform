import Link from 'next/link'

export default function TermsPage() {
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
        <h1 className="text-4xl font-semibold mb-8">Terms of Service</h1>
        <p className="text-sm text-neutral-500 mb-8">Last updated: January 2025</p>

        <div className="prose prose-neutral max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-neutral-600 mb-4">
              Welcome to StudyMate, an AI-powered tutoring platform operated by SOFTSYS PTY LTD
              (ABN 64 663 472 759), trading as Enhanced Software Systems (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
            </p>
            <p className="text-neutral-600 mb-4">
              By accessing or using our service at tutor.agentsform.ai, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Service Description</h2>
            <p className="text-neutral-600 mb-4">
              StudyMate provides AI-powered educational tutoring services for Australian students
              from Prep to Year 12. Our services include:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
              <li>Personalised learning questions aligned with the Australian curriculum</li>
              <li>AI-generated explanations and tutoring assistance</li>
              <li>Progress tracking and reporting for parents</li>
              <li>Adaptive difficulty based on student performance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Account Registration</h2>
            <p className="text-neutral-600 mb-4">
              To use StudyMate, you must create an account and provide accurate information.
              Parents or guardians must register accounts for children under 18. You are
              responsible for maintaining the confidentiality of your account credentials.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Subscription Plans</h2>
            <p className="text-neutral-600 mb-4">
              We offer the following subscription plans:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
              <li><strong>Explorer (Free):</strong> 2 child profiles, 20 questions/day, 10 AI explanations/day</li>
              <li><strong>Scholar ($5/month):</strong> 5 child profiles, unlimited questions and AI explanations</li>
              <li><strong>Achiever ($12/month):</strong> 10 child profiles, term reports, curriculum mapping, priority support</li>
            </ul>
            <p className="text-neutral-600 mb-4">
              All prices are in Australian Dollars (AUD) and include GST where applicable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Payment Terms</h2>
            <p className="text-neutral-600 mb-4">
              Paid subscriptions are billed monthly in advance. Payment is processed securely
              through Stripe. By subscribing, you authorise us to charge your payment method
              on a recurring basis until you cancel.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Cancellation</h2>
            <p className="text-neutral-600 mb-4">
              You may cancel your subscription at any time through your account dashboard or
              by contacting us. Upon cancellation, you will retain access to paid features
              until the end of your current billing period. No partial refunds are provided
              for unused portions of a billing period.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Acceptable Use</h2>
            <p className="text-neutral-600 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
              <li>Use the service for any unlawful purpose</li>
              <li>Share account credentials with others</li>
              <li>Attempt to reverse engineer or exploit the platform</li>
              <li>Use automated systems to access the service</li>
              <li>Harass, abuse, or harm other users</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Intellectual Property</h2>
            <p className="text-neutral-600 mb-4">
              All content, features, and functionality of StudyMate are owned by SOFTSYS PTY LTD
              and are protected by Australian and international copyright laws. You may not
              reproduce, distribute, or create derivative works without our permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="text-neutral-600 mb-4">
              StudyMate is provided &quot;as is&quot; without warranties of any kind. We are not liable
              for any indirect, incidental, or consequential damages arising from your use of
              the service. Our total liability shall not exceed the amount paid by you in the
              12 months preceding any claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Changes to Terms</h2>
            <p className="text-neutral-600 mb-4">
              We may update these terms from time to time. We will notify you of significant
              changes via email or through the platform. Continued use of the service after
              changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">11. Governing Law</h2>
            <p className="text-neutral-600 mb-4">
              These terms are governed by the laws of Victoria, Australia. Any disputes shall
              be resolved in the courts of Victoria.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">12. Contact Us</h2>
            <p className="text-neutral-600 mb-4">
              If you have questions about these terms, please contact us:
            </p>
            <div className="text-neutral-600 space-y-1">
              <p><strong>SOFTSYS PTY LTD</strong></p>
              <p>Trading as Enhanced Software Systems</p>
              <p>ABN: 64 663 472 759</p>
              <p>17 Koomba Crescent, Greenvale VIC 3059, Australia</p>
              <p>Email: <a href="mailto:support@agentsform.ai" className="text-black underline">support@agentsform.ai</a></p>
              <p>Phone: <a href="tel:+61410386167" className="text-black underline">+61 410 386 167</a></p>
            </div>
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
