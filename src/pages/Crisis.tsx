import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Shield, Globe, Phone, Heart, Brain, 
  MessageSquare, AlertTriangle, Sparkles, Target 
} from 'lucide-react';

// Crisis resources by country
const CRISIS_RESOURCES = {
  'Afghanistan': {
    emergency: '119',
    suicide_prevention: '119',
    crisis_text: 'N/A',
    resources: [
      { name: 'Afghanistan National Emergency Number', number: '119' }
    ]
  },
  'Albania': {
    emergency: '127',
    suicide_prevention: '127',
    crisis_text: 'N/A',
    resources: [
      { name: 'National Emergency', number: '127' },
      { name: 'Police', number: '129' }
    ]
  },
  'Algeria': {
    emergency: '14',
    suicide_prevention: '14',
    crisis_text: 'N/A',
    resources: [
      { name: 'Protection Civile', number: '14' }
    ]
  },
  'Argentina': {
    emergency: '911',
    suicide_prevention: '135',
    crisis_text: 'N/A',
    resources: [
      { name: 'Centro de Asistencia al Suicida', number: '135' }
    ]
  },
  'Australia': {
    emergency: '000',
    suicide_prevention: '13 11 14',
    crisis_text: 'Text 0477 13 11 14',
    resources: [
      { name: 'Lifeline', number: '13 11 14' },
      { name: 'Beyond Blue', number: '1300 22 4636' },
      { name: 'Kids Helpline', number: '1800 55 1800' }
    ]
  },
  'Austria': {
    emergency: '112',
    suicide_prevention: '142',
    crisis_text: 'N/A',
    resources: [
      { name: 'Telefonseelsorge', number: '142' }
    ]
  },
  'Belgium': {
    emergency: '112',
    suicide_prevention: '1813',
    crisis_text: 'N/A',
    resources: [
      { name: 'Zelfmoordlijn', number: '1813' },
      { name: 'Télé-Accueil', number: '107' }
    ]
  },
  'Brazil': {
    emergency: '192',
    suicide_prevention: '188',
    crisis_text: 'N/A',
    resources: [
      { name: 'CVV - Centro de Valorização da Vida', number: '188' }
    ]
  },
  'Canada': {
    emergency: '911',
    suicide_prevention: '1-833-456-4566',
    crisis_text: 'Text CONNECT to 686868',
    resources: [
      { name: 'Canada Suicide Prevention Service', number: '1-833-456-4566' },
      { name: 'Kids Help Phone', number: '1-800-668-6868' },
      { name: 'Crisis Services Canada', number: '1-833-456-4566' }
    ]
  },
  'China': {
    emergency: '120',
    suicide_prevention: '800-810-1117',
    crisis_text: 'N/A',
    resources: [
      { name: 'Beijing Suicide Research and Prevention Center', number: '800-810-1117' }
    ]
  },
  'Denmark': {
    emergency: '112',
    suicide_prevention: '70 201 201',
    crisis_text: 'N/A',
    resources: [
      { name: 'Livslinien', number: '70 201 201' }
    ]
  },
  'Finland': {
    emergency: '112',
    suicide_prevention: '09-2525-0111',
    crisis_text: 'N/A',
    resources: [
      { name: 'Crisis Helpline', number: '09-2525-0111' }
    ]
  },
  'France': {
    emergency: '112',
    suicide_prevention: '3114',
    crisis_text: 'N/A',
    resources: [
      { name: 'SOS Amitié', number: '09 72 39 40 50' },
      { name: 'Suicide Écoute', number: '01 45 39 40 00' }
    ]
  },
  'Germany': {
    emergency: '112',
    suicide_prevention: '0800 111 0 111',
    crisis_text: 'N/A',
    resources: [
      { name: 'Telefonseelsorge', number: '0800 111 0 111' },
      { name: 'Nummer gegen Kummer', number: '116 111' }
    ]
  },
  'Greece': {
    emergency: '112',
    suicide_prevention: '1018',
    crisis_text: 'N/A',
    resources: [
      { name: 'Suicide Help Greece', number: '1018' }
    ]
  },
  'India': {
    emergency: '112',
    suicide_prevention: '9152987821',
    crisis_text: 'N/A',
    resources: [
      { name: 'AASRA', number: '91-9820466726' },
      { name: 'Vandrevala Foundation', number: '1860-2662-345' }
    ]
  },
  'Ireland': {
    emergency: '112',
    suicide_prevention: '116 123',
    crisis_text: 'Text HELLO to 50808',
    resources: [
      { name: 'Samaritans Ireland', number: '116 123' },
      { name: 'Pieta House', number: '1800 247 247' }
    ]
  },
  'Israel': {
    emergency: '101',
    suicide_prevention: '1201',
    crisis_text: 'N/A',
    resources: [
      { name: 'ERAN', number: '1201' }
    ]
  },
  'Italy': {
    emergency: '112',
    suicide_prevention: '800 86 00 22',
    crisis_text: 'N/A',
    resources: [
      { name: 'Telefono Amico', number: '199 284 284' }
    ]
  },
  'Japan': {
    emergency: '119',
    suicide_prevention: '0120-279-338',
    crisis_text: 'N/A',
    resources: [
      { name: 'TELL Lifeline', number: '03-5774-0992' },
      { name: 'Tokyo Mental Health', number: '0570-00-9110' }
    ]
  },
  'Mexico': {
    emergency: '911',
    suicide_prevention: '800 911 2000',
    crisis_text: 'N/A',
    resources: [
      { name: 'SAPTEL', number: '800 911 2000' }
    ]
  },
  'Netherlands': {
    emergency: '112',
    suicide_prevention: '0800-0113',
    crisis_text: 'N/A',
    resources: [
      { name: '113 Zelfmoordpreventie', number: '0800-0113' }
    ]
  },
  'New Zealand': {
    emergency: '111',
    suicide_prevention: '1737',
    crisis_text: 'Text 1737',
    resources: [
      { name: 'Lifeline', number: '0800 543 354' },
      { name: 'Youthline', number: '0800 376 633' }
    ]
  },
  'Norway': {
    emergency: '113',
    suicide_prevention: '116 123',
    crisis_text: 'N/A',
    resources: [
      { name: 'Mental Helse', number: '116 123' }
    ]
  },
  'Poland': {
    emergency: '112',
    suicide_prevention: '800 70 2222',
    crisis_text: 'N/A',
    resources: [
      { name: 'ITAKA Center', number: '800 70 2222' }
    ]
  },
  'Portugal': {
    emergency: '112',
    suicide_prevention: '800 273 273',
    crisis_text: 'N/A',
    resources: [
      { name: 'SOS Voz Amiga', number: '800 273 273' }
    ]
  },
  'Russia': {
    emergency: '112',
    suicide_prevention: '8-800-333-44-34',
    crisis_text: 'N/A',
    resources: [
      { name: 'Russia Suicide Prevention', number: '8-800-333-44-34' }
    ]
  },
  'Singapore': {
    emergency: '995',
    suicide_prevention: '1800-221-4444',
    crisis_text: 'N/A',
    resources: [
      { name: 'Samaritans of Singapore', number: '1800-221-4444' }
    ]
  },
  'South Africa': {
    emergency: '10111',
    suicide_prevention: '0800 567 567',
    crisis_text: 'N/A',
    resources: [
      { name: 'SADAG', number: '0800 567 567' },
      { name: 'Lifeline', number: '0861 322 322' }
    ]
  },
  'South Korea': {
    emergency: '119',
    suicide_prevention: '1393',
    crisis_text: 'N/A',
    resources: [
      { name: 'Korea Suicide Prevention Center', number: '1393' },
      { name: 'Seoul Global Center', number: '02-2075-4180' }
    ]
  },
  'Spain': {
    emergency: '112',
    suicide_prevention: '024',
    crisis_text: 'N/A',
    resources: [
      { name: 'Teléfono de la Esperanza', number: '717 003 717' }
    ]
  },
  'Sweden': {
    emergency: '112',
    suicide_prevention: '90101',
    crisis_text: 'N/A',
    resources: [
      { name: 'Mind Sverige', number: '90101' }
    ]
  },
  'Switzerland': {
    emergency: '112',
    suicide_prevention: '143',
    crisis_text: 'N/A',
    resources: [
      { name: 'Die Dargebotene Hand', number: '143' }
    ]
  },
  'United Kingdom': {
    emergency: '999',
    suicide_prevention: '116 123',
    crisis_text: 'Text SHOUT to 85258',
    resources: [
      { name: 'Samaritans', number: '116 123' },
      { name: 'CALM', number: '0800 58 58 58' },
      { name: 'Mind', number: '0300 123 3393' }
    ]
  },
  'United States': {
    emergency: '911',
    suicide_prevention: '988',
    crisis_text: 'Text HOME to 741741',
    resources: [
      { name: 'National Suicide Prevention Lifeline', number: '988' },
      { name: 'SAMHSA Treatment Referral Hotline', number: '1-800-662-4357' },
      { name: 'Veterans Crisis Line', number: '988 (Press 1)' }
    ]
  }
} as const;

type CountryKey = keyof typeof CRISIS_RESOURCES;

const COPING_STRATEGIES = [
  {
    icon: <Heart className="h-5 w-5" />,
    title: 'Deep Breathing',
    description: 'Take slow, deep breaths. Inhale for 4 counts, hold for 4, exhale for 4.'
  },
  {
    icon: <Brain className="h-5 w-5" />,
    title: '5-4-3-2-1 Grounding',
    description: 'Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.'
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: 'Reach Out',
    description: 'Contact a trusted friend, family member, or professional.'
  }
];

const SELF_HELP_RESOURCES = [
  {
    icon: <Sparkles />,
    title: 'Mindfulness Exercises',
    description: 'Simple mindfulness practices to help you stay present and centered.',
    link: '/morning'
  },
  {
    icon: <Target />,
    title: 'Goal Setting',
    description: 'Set small, achievable goals to maintain focus and purpose.',
    link: '/mood'
  },
  {
    icon: <MessageSquare />,
    title: 'AI Support Chat',
    description: 'Talk to our AI companion about your thoughts and feelings.',
    link: '/chat'
  }
];

export default function Crisis() {
  const [selectedCountry, setSelectedCountry] = useState<CountryKey>('United States');
  const resources = CRISIS_RESOURCES[selectedCountry];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
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
            <Shield className="h-6 w-6 text-red-600" />
            <span className="text-lg font-semibold text-gray-900">Crisis Support</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Emergency Resources */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Emergency Resources</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-gray-500" />
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value as CountryKey)}
                    className="rounded-lg border-gray-300 text-sm focus:border-red-500 focus:ring-red-500"
                  >
                    {Object.keys(CRISIS_RESOURCES).map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {/* Emergency Number */}
                <div className="bg-red-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Phone className="h-6 w-6 text-red-600" />
                    <h3 className="text-lg font-semibold text-red-900">
                      Emergency: {resources.emergency}
                    </h3>
                  </div>
                  <p className="text-red-800">
                    For immediate life-threatening emergencies, call your local emergency number.
                    Help is available 24/7.
                  </p>
                </div>

                {/* Crisis Hotlines */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-orange-900 mb-4">
                      Suicide Prevention
                    </h3>
                    <p className="text-2xl font-bold text-orange-900 mb-2">
                      {resources.suicide_prevention}
                    </p>
                    <p className="text-orange-800 text-sm">
                      Professional support available 24/7
                    </p>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-orange-900 mb-4">
                      Crisis Text Line
                    </h3>
                    <p className="text-2xl font-bold text-orange-900 mb-2">
                      {resources.crisis_text}
                    </p>
                    <p className="text-orange-800 text-sm">
                      Text-based support available 24/7
                    </p>
                  </div>
                </div>

                {/* Additional Resources */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Additional Support Resources
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources.resources.map((resource, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {resource.name}
                        </h4>
                        <p className="text-xl font-semibold text-gray-900">
                          {resource.number}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Self-Help Resources */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Additional Support Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SELF_HELP_RESOURCES.map((resource, index) => (
                  <Link
                    key={index}
                    to={resource.link}
                    className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-indigo-600 mb-3">
                      {resource.icon}
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {resource.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Coping Strategies */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Brain className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Coping Strategies</h2>
              </div>

              <div className="space-y-4">
                {COPING_STRATEGIES.map((strategy, index) => (
                  <div key={index} className="bg-purple-50 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <div className="text-purple-600 mt-1">
                        {strategy.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-purple-900 mb-2">
                          {strategy.title}
                        </h3>
                        <p className="text-sm text-purple-800">
                          {strategy.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-orange-50 rounded-xl p-6">
                  <h3 className="font-medium text-orange-900 mb-3">
                    Remember
                  </h3>
                  <ul className="space-y-2 text-sm text-orange-800">
                    <li>• You're not alone in this</li>
                    <li>• It's okay to ask for help</li>
                    <li>• Your feelings are valid</li>
                    <li>• This moment will pass</li>
                    <li>• Help is always available</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}