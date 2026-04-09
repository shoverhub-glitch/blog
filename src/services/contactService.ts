import { supabase } from '../lib/supabase';
import { settingsService } from '../admin/services/settingsService';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 5000;

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateFormData = (data: ContactFormData): ValidationResult => {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push('Name is required');
  } else if (data.name.length > MAX_NAME_LENGTH) {
    errors.push(`Name must be less than ${MAX_NAME_LENGTH} characters`);
  }

  if (!data.email?.trim()) {
    errors.push('Email is required');
  } else if (!validateEmail(data.email)) {
    errors.push('Please enter a valid email address');
  } else if (data.email.length > MAX_EMAIL_LENGTH) {
    errors.push(`Email must be less than ${MAX_EMAIL_LENGTH} characters`);
  }

  if (!data.subject?.trim()) {
    errors.push('Subject is required');
  } else if (data.subject.length > MAX_SUBJECT_LENGTH) {
    errors.push(`Subject must be less than ${MAX_SUBJECT_LENGTH} characters`);
  }

  if (!data.message?.trim()) {
    errors.push('Message is required');
  } else if (data.message.length > MAX_MESSAGE_LENGTH) {
    errors.push(`Message must be less than ${MAX_MESSAGE_LENGTH} characters`);
  }

  return { valid: errors.length === 0, errors };
};

const detectSpam = (data: ContactFormData): boolean => {
  const spamIndicators = [
    /\b(buy|cheap|free|money|win|prize|casino|lottery)\b/i,
    /\b(viagra|cialis|pill|pharmacy)\b/i,
    /(https?:\/\/)?(www\.)?(bit\.ly|tinyurl|goo\.gl)\//i,
    /(.){50,}.*(.){50,}/,
  ];

  const combinedText = `${data.name} ${data.subject} ${data.message}`.toLowerCase();

  for (const pattern of spamIndicators) {
    if (pattern.test(combinedText)) {
      return true;
    }
  }

  if (data.message.split(/\s+/).length > 200) {
    return true;
  }

  return false;
};

export const contactService = {
  async submitMessage(data: ContactFormData, honeypot?: string): Promise<{ success: boolean; message: string }> {
    const isEnabled = await settingsService.getSetting('admin_contact_messages_enabled');
    if (!isEnabled) {
      return { success: false, message: 'Contact form is currently disabled.' };
    }

    if (honeypot && honeypot.trim() !== '') {
      console.log('Bot submission detected and blocked');
      return { success: true, message: 'Thank you for your message!' };
    }

    const validation = validateFormData(data);
    if (!validation.valid) {
      return { success: false, message: validation.errors[0] };
    }

    if (detectSpam(data)) {
      console.log('Spam detected and blocked');
      return { success: true, message: 'Thank you for your message!' };
    }

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          subject: data.subject.trim(),
          message: data.message.trim(),
        }]);

      if (error) throw error;

      return { success: true, message: 'Thank you for your message!' };
    } catch (error) {
      console.error('Failed to submit contact message:', error);
      return { success: false, message: 'Failed to send message. Please try again.' };
    }
  },
};