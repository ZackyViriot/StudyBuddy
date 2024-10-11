import React, { useState } from "react";
import { BookOpen, Users, Calendar, Search, MapPin } from "lucide-react"
import LoginForm from "../signUpAndLogin/LoginForm";
import SignUpForm from "../signUpAndLogin/SignUpForm";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('login')

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-200">
        <div className="flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-black" />
          <span className="ml-2 text-2xl font-bold text-black">StudyBuddy</span>
        </div>
        
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-100">
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
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                  <div className="flex mb-4">
                    <button
                      className={`flex-1 py-2 text-center ${
                        activeTab === "login"
                          ? "border-b-2 border-black text-black"
                          : "text-gray-500"
                      }`}
                      onClick={() => setActiveTab("login")}
                    >
                      Login
                    </button>
                    <button
                      className={`flex-1 py-2 text-center ${
                        activeTab === "signup"
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