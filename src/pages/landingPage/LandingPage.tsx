import React, { useState } from "react";
import { BookOpen, Users, Calendar, Search, MapPin, Mail, Phone } from "lucide-react"
import { FormEvent, ChangeEvent } from "react";
import LoginForm from "../signUpAndLogin/LoginForm";
import SignUpForm from "../signUpAndLogin/SignUpForm";
import UniversityMovingGallery from "./LandingPageComponents/UniversityMovingGallery";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('login')
  const [formStatus, setFormStatus] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/xanynozz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md animate-fade-down opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-bold">StudyBuddy</div>
            <nav className="hidden md:flex space-x-8">
              <a href="#about" className="hover:text-gray-600">About</a>
              <a href="#features" className="hover:text-gray-600">Features</a>
              <a href="#contact" className="hover:text-gray-600">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              {/* Left side content */}
              <div className="flex flex-col justify-center space-y-4 animate-fade-right opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards]">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Find Your Perfect Study Group
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Connect with fellow students, share knowledge, and excel together. Join StudyBuddy today!
                </p>
              </div>

              {/* Login/Signup Form */}
              <div className="flex items-center justify-center animate-fade-left opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards]">
                <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
                  <div className="flex mb-4 border-b">
                    <button
                      className={`flex-1 py-2 text-center ${activeTab === 'login' ? 'border-b-2 border-black' : ''}`}
                      onClick={() => setActiveTab('login')}
                    >
                      Login
                    </button>
                    <button
                      className={`flex-1 py-2 text-center ${activeTab === 'signup' ? 'border-b-2 border-black' : ''}`}
                      onClick={() => setActiveTab('signup')}
                    >
                      Sign Up
                    </button>
                  </div>
                  {activeTab === 'login' ? <LoginForm /> : <SignUpForm />}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-white animate-fade-up opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards]">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-8">About StudyBuddy</h2>
            <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
              StudyBuddy is your ultimate platform for connecting with fellow students and forming effective study groups.
              Whether you're preparing for exams, working on projects, or seeking academic support, we're here to help you succeed.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12 animate-fade-up opacity-0 [animation-delay:1000ms] [animation-fill-mode:forwards]">
              Why Choose StudyBuddy?
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg animate-fade-up opacity-0 [animation-delay:1200ms] [animation-fill-mode:forwards]">
                <BookOpen className="w-12 h-12 mb-4 text-black" />
                <h3 className="text-xl font-bold mb-2">Smart Matching</h3>
                <p className="text-gray-600">Find study partners based on your courses, study style, and schedule.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg animate-fade-up opacity-0 [animation-delay:1400ms] [animation-fill-mode:forwards]">
                <Users className="w-12 h-12 mb-4 text-black" />
                <h3 className="text-xl font-bold mb-2">Group Management</h3>
                <p className="text-gray-600">Easily organize and manage your study groups in one place.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg animate-fade-up opacity-0 [animation-delay:1600ms] [animation-fill-mode:forwards]">
                <Calendar className="w-12 h-12 mb-4 text-black" />
                <h3 className="text-xl font-bold mb-2">Schedule Coordination</h3>
                <p className="text-gray-600">Coordinate meeting times that work for everyone in your group.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Universities Section */}
        <section className="py-12 md:py-24 bg-white animate-fade-up opacity-0 [animation-delay:1800ms] [animation-fill-mode:forwards]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Trusted by Students at Top Universities</h2>
            <UniversityMovingGallery />
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 animate-fade-up opacity-0 [animation-delay:2000ms] [animation-fill-mode:forwards]">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Contact Form */}
              <div className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
                    disabled={formStatus === 'sending'}
                  >
                    {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                  {formStatus === 'success' && (
                    <p className="text-green-600">Message sent successfully!</p>
                  )}
                  {formStatus === 'error' && (
                    <p className="text-red-600">Failed to send message. Please try again.</p>
                  )}
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6" />
                  <span>123 University Ave, City, State 12345</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6" />
                  <span>contact@studybuddy.com</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6" />
                  <span>(123) 456-7890</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 bg-white border-t animate-fade-up opacity-0 [animation-delay:2200ms] [animation-fill-mode:forwards]">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 StudyBuddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}