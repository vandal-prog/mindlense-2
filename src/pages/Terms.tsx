import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-gray-600" />
            <span className="text-lg font-semibold text-gray-900">Terms & Conditions</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
          
          <div className="prose prose-indigo max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                By using MindLense, you agree to these Terms and Conditions. If you do not agree, please discontinue use immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Privacy Policy</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Your use of MindLense is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Service Description</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                MindLense provides mental wellness support through AI-powered conversations and mood tracking. While we strive to provide helpful support, our service is not a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Limitations</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                MindLense is not intended to provide medical or professional mental health services. In case of emergency, please contact appropriate emergency services or mental health crisis hotlines.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                For any questions about these Terms, please contact us at{' '}
                <a href="mailto:support@mindlense.com" className="text-indigo-600 hover:text-indigo-700">
                  support@mindlense.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}