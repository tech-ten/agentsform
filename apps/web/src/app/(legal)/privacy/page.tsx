import Link from 'next/link'

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-semibold mb-8">Privacy Policy</h1>
        <p className="text-sm text-neutral-500 mb-8">Last updated: January 2026</p>

        <div className="prose prose-neutral max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-neutral-600 mb-4">
              SOFTSYS PTY LTD (ABN 64 663 472 759), trading as Enhanced Software Systems,
              operates StudyMate (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). We are committed to protecting the
              privacy of our users, particularly children.
            </p>
            <p className="text-neutral-600 mb-4">
              This Privacy Policy explains how we collect, use, and protect your personal
              information when you use our AI tutoring platform at tutor.agentsform.ai.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-medium mb-3">Account Information</h3>
            <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
              <li>Parent/guardian email address and password</li>
              <li>Child profile names and year levels</li>
              <li>Subscription and payment information (processed by Stripe)</li>
            </ul>

            <h3 className="text-lg font-medium mb-3">Usage Information</h3>
            <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
              <li>Learning progress and quiz results</li>
              <li>Questions asked to the AI tutor</li>
              <li>Time spent on the platform</li>
              <li>Device and browser information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-neutral-600 mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
              <li>Provide personalised learning experiences</li>
              <li>Track and report learning progress to parents</li>
              <li>Improve our AI tutoring algorithms</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send important service updates</li>
              <li>Provide customer support</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Children&apos;s Privacy</h2>
            <p className="text-neutral-600 mb-4">
              We take children&apos;s privacy seriously. We do not:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
              <li>Collect personal information directly from children without parental consent</li>
              <li>Share children&apos;s data with third parties for marketing</li>
              <li>Display targeted advertising to children</li>
              <li>Allow children to publicly share personal information</li>
            </ul>
            <p className="text-neutral-600 mb-4">
              Parents can review, modify, or delete their children&apos;s information at any time
              through their account dashboard.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Data Sharing</h2>
            <p className="text-neutral-600 mb-4">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
              <li><strong>Stripe:</strong> For secure payment processing</li>
              <li><strong>AWS:</strong> For hosting and data storage</li>
              <li><strong>AI providers:</strong> To power tutoring features (data is anonymised)</li>
              <li><strong>Legal authorities:</strong> When required by law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Data Security</h2>
            <p className="text-neutral-600 mb-4">
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication with AWS Cognito</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and monitoring</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Data Retention</h2>
            <p className="text-neutral-600 mb-4">
              We retain your data for as long as your account is active or as needed to provide
              services. Upon account deletion, we will delete your personal information within
              30 days, except where retention is required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Your Rights</h2>
            <p className="text-neutral-600 mb-4">
              Under Australian Privacy Principles, you have the right to:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
              <li>Lodge a complaint with the OAIC</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Cookies</h2>
            <p className="text-neutral-600 mb-4">
              We use essential cookies for authentication and session management. We do not
              use tracking cookies for advertising purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p className="text-neutral-600 mb-4">
              We may update this policy from time to time. We will notify you of significant
              changes via email or through the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">11. Contact Us</h2>
            <p className="text-neutral-600 mb-4">
              For privacy-related inquiries or to exercise your rights:
            </p>
            <div className="text-neutral-600 space-y-1">
              <p><strong>Privacy Officer</strong></p>
              <p>SOFTSYS PTY LTD</p>
              <p>Email: <a href="mailto:tendai@agentsform.ai" className="text-black underline">tendai@agentsform.ai</a></p>
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
