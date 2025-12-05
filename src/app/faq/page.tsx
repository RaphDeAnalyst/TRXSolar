'use client';

import { useState } from 'react';

const FAQItems = [
  {
    question: 'What is the difference between monocrystalline and polycrystalline panels?',
    answer:
      'Monocrystalline panels have higher efficiency and better performance in low light, making them ideal for residential installations. Polycrystalline panels are more cost-effective and suitable for budget-conscious installations.',
  },
  {
    question: 'How long do solar panels last?',
    answer:
      'Most solar panels come with a 25-year warranty and can last 25-30 years or more. They gradually degrade by about 0.5% per year, meaning after 25 years they still produce 80%+ of their original power.',
  },
  {
    question: 'What is an MPPT charge controller?',
    answer:
      'An MPPT (Maximum Power Point Tracking) controller optimizes the power drawn from solar panels by continuously adjusting the electrical operating point. It can increase efficiency by 20-30% compared to PWM controllers.',
  },
  {
    question: 'Can I use a hybrid inverter instead of a regular inverter?',
    answer:
      'Yes! Hybrid inverters are versatile and can work with or without batteries. They offer more flexibility for future expansion and are ideal if you want to add battery storage later.',
  },
  {
    question: 'How do I choose the right battery for my system?',
    answer:
      'Consider your daily energy consumption, desired backup time, budget, and space. Lithium batteries offer higher efficiency and longer lifespan, while lead-acid batteries are more affordable. We recommend consulting with our team for personalized recommendations.',
  },
  {
    question: 'Do you offer installation services?',
    answer:
      'We provide premium solar products and expert consultation. For installation services, we can connect you with certified installers in your area.',
  },
];

export default function FAQPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto px-sm py-lg">
        <h1 className="text-h1 text-text-primary font-bold mb-lg">Frequently Asked Questions</h1>

        <div className="space-y-sm">
          {FAQItems.map((item, idx) => (
            <div key={idx} className="border border-border">
              <button
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                className="w-full px-md py-md flex items-center justify-between bg-surface hover:bg-background transition-colors"
              >
                <span className="text-body font-medium text-text-primary text-left">{item.question}</span>
                <span className="text-primary ml-md flex-shrink-0">
                  {expandedIndex === idx ? '−' : '+'}
                </span>
              </button>

              {expandedIndex === idx && (
                <div className="px-md py-md bg-background border-t border-border">
                  <p className="text-body text-text-primary leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
