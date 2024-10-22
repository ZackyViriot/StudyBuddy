import React, { useState } from "react";
import { BookOpen, Users, Calendar, Search, MapPin, Mail, Phone } from "lucide-react"
import { FormEvent, ChangeEvent } from "react";
import LoginForm from "../signUpAndLogin/LoginForm";
import SignUpForm from "../signUpAndLogin/SignUpForm";
import UniversityMovingGallery from "./LandingPageComponents/UniversityMovingGallery";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('login')
  //need to add some state for the contact us section 
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-4 lg:px-6 h-16 flex items-center">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-black" />
            <span className="ml-2 text-2xl font-bold text-black">StudyBuddy</span>
          </div>
          <nav className="hidden md:flex space-x-4">
            <a href="#about" className="text-sm font-medium hover:text-blue-600">About</a>
            <a href="#features" className="text-sm font-medium hover:text-blue-600">Features</a>
            <a href="#contact" className="text-sm font-medium hover:text-blue-600">Contact</a>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-12 lg:py-12 xl:py-12 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">

            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">

              <div className="flex flex-col justify-center space-y-4">

                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                    Find your perfect study group
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    Connect with like-minded students, share knowledge, and ace your exams together. Join StudyBuddy today!
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  {/* <form className="flex space-x-2">
                    <input 
                      className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black" 
                      placeholder="Enter your subject" 
                      type="text" 
                    />
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-black text-white font-bold text-sm rounded-md hover:bg-gray-800 transition-colors"
                    >
                      Find Groups
                    </button>
                  </form> */}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg border mb-10 border-gray-200">
                  <div className="flex mb-4">
                    <button
                      className={`flex-1 py-2 text-center ${activeTab === "login"
                        ? "border-b-2 border-black text-black"
                        : "text-gray-500"
                        }`}
                      onClick={() => setActiveTab("login")}
                    >
                      Login
                    </button>
                    <button
                      className={`flex-1 py-2 text-center ${activeTab === "signup"
                        ? "border-b-2 border-black text-black"
                        : "text-gray-500"
                        }`}
                      onClick={() => setActiveTab("signup")}
                    >
                      Sign Up
                    </button>
                  </div>
                  {activeTab === "login" ? <LoginForm /> : <SignUpForm />}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id='about' className="w-full py-12 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-8"> About StudyBuddy</h2>
          </div>
          <div className="grid gap-6 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
                StudyBuddy is a platform designed to help students connect, collaborate, and excel in their academic pursuits.
                We believe that learning is more effective and enjoyable when done together. Our mission is to create a
                global community of learners who support and inspire each other to achieve their educational goals.
              </p>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Why Choose StudyBuddy?</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center p-4">
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Find Your Tribe</h3>
                <p className="text-gray-600">Connect with students who share your academic interests and goals.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <Calendar className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
                <p className="text-gray-600">Organize study sessions that fit everyone's timetable.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <MapPin className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Virtual & In-Person</h3>
                <p className="text-gray-600">Choose between online and face-to-face study groups.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="bg-gray-50">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                <span className="block">Participating Universities</span>
              </h2>
              <div className="mt-6">
                <UniversityMovingGallery />
              </div>
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
            <div className="grid gap-6 md:grid-cols-2 items-center">
              <div className="space-y-4">
                <p className="text-xl text-gray-600">
                  Have questions or suggestions? We'd love to hear from you!
                </p>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span>support@studybuddy.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
            focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  placeholder="Your Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
                <input
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
            focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  placeholder="Your Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
                <textarea
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
            focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  rows={4}
                  placeholder="Your Message"
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  required
                ></textarea>
                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 
            focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-gray-400"
                >
                  {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
                {formStatus === 'success' && (
                  <p className="text-green-600 text-center">Message sent successfully!</p>
                )}
                {formStatus === 'error' && (
                  <p className="text-red-600 text-center">Failed to send message. Please try again.</p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 border-t border-gray-200">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-center text-gray-600 text-sm">
            © 2024 StudyBuddy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}