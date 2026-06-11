import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Mail, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';
import { services } from '../data';

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    service: services[0].title,
    details: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contacts'), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        details: `Service Requested: ${formData.service}\n\n${formData.details}`,
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', service: services[0].title, details: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'contacts');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-brand-50 min-h-screen">
      <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-900 mb-6 tracking-tight">
            Let's build together.
          </h1>
          <p className="text-xl font-medium text-gray-600 max-w-2xl mx-auto">
            Ready to dramatically scale your brand? Drop us a line and let's get to work.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <AnimatedSection delay={0.1}>
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-brand-100">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                  <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-brand-900 mb-2">Message Sent!</h3>
                  <p className="text-brand-600/80 font-medium max-w-sm">
                    Thanks for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 text-brand-600 font-bold text-xs uppercase tracking-widest hover:text-brand-800 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-black text-brand-400 mb-2">First Name</label>
                      <input 
                        type="text" 
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-brand-900 font-medium" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-black text-brand-400 mb-2">Last Name</label>
                      <input 
                        type="text" 
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-brand-900 font-medium" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-black text-brand-400 mb-2">Work Email</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-brand-900 font-medium" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-black text-brand-400 mb-2">Service Needed</label>
                    <select 
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-brand-900 font-medium" 
                    >
                      {services.map((service) => (
                        <option key={service.id} value={service.title}>{service.title}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-black text-brand-400 mb-2">Project Details</label>
                    <textarea 
                      rows={5} 
                      name="details"
                      required
                      value={formData.details}
                      onChange={handleChange}
                      className="w-full bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors resize-none text-brand-900 font-medium"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white pb-3 pt-4 px-8 rounded-full font-bold text-xs uppercase tracking-widest transition-colors shadow-md shadow-brand-200 mt-4 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2} className="flex justify-center flex-col">
            <div className="space-y-10 pl-0 lg:pl-10">
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-400 mb-3">Reach Out</h3>
                <h2 className="text-4xl font-display font-bold text-brand-900 mb-8 tracking-tight">Contact Info</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-brand-100 text-brand-600 flex items-center justify-center shrink-0 shadow-sm">
                      <Mail size={20} />
                    </div>
                    <div className="mt-1">
                      <p className="text-[10px] uppercase tracking-widest font-black text-brand-400 mb-1">Email Us</p>
                      <p className="text-brand-900 font-bold">hello@kroma.agency</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-brand-100 text-brand-600 flex items-center justify-center shrink-0 shadow-sm">
                      <Phone size={20} />
                    </div>
                    <div className="mt-1">
                      <p className="text-[10px] uppercase tracking-widest font-black text-brand-400 mb-1">Call Us</p>
                      <p className="text-brand-900 font-bold">+1 (555) 000-0000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-brand-100 text-brand-600 flex items-center justify-center shrink-0 shadow-sm">
                      <MapPin size={20} />
                    </div>
                    <div className="mt-1">
                      <p className="text-[10px] uppercase tracking-widest font-black text-brand-400 mb-1">Visit Us</p>
                      <p className="text-brand-900 font-bold">123 Marketing Ave, Suite 400<br/>New York, NY 10001</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
