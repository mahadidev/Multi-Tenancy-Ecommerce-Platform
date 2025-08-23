'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api';

interface ContactFormProps {
  title?: string;
  description?: string;
  form_id?: number;
  fields?: Array<{
    name: string;
    type: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
  }>;
  submit_button_text?: string;
  success_message?: string;
  websiteSubdomain?: string;
}

export function ContactForm({
  title = 'Contact Us',
  description = 'Get in touch with us',
  form_id,
  fields = [
    { name: 'name', type: 'text', label: 'Name', required: true },
    { name: 'email', type: 'email', label: 'Email', required: true },
    { name: 'subject', type: 'text', label: 'Subject', required: false },
    { name: 'message', type: 'textarea', label: 'Message', required: true }
  ],
  submit_button_text = 'Send Message',
  success_message = 'Thank you for your message! We\'ll get back to you soon.',
  websiteSubdomain
}: ContactFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!websiteSubdomain || !form_id) {
      setError('Form configuration error');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await apiClient.submitForm(websiteSubdomain, form_id, formData);
      setSubmitted(true);
      setFormData({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent!</h3>
            <p className="text-green-700">{success_message}</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 text-green-600 hover:text-green-800 underline"
            >
              Send another message
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={formData[field.name] || ''}
              onChange={(value) => handleInputChange(field.name, value)}
            />
          ))}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {submitting ? 'Sending...' : submit_button_text}
          </button>
        </form>
      </div>
    </section>
  );
}

interface FormFieldProps {
  field: {
    name: string;
    type: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
  };
  value: string;
  onChange: (value: string) => void;
}

function FormField({ field, value, onChange }: FormFieldProps) {
  const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  switch (field.type) {
    case 'textarea':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className={baseClasses}
          />
        </div>
      );

    case 'select':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className={baseClasses}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );

    case 'checkbox':
      return (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={value === 'true'}
            onChange={(e) => onChange(e.target.checked ? 'true' : 'false')}
            required={field.required}
            className="mr-2"
          />
          <label className="text-sm text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      );

    default:
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type={field.type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={baseClasses}
          />
        </div>
      );
  }
}