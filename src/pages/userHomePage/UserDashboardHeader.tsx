import React from "react";


const user: User = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    avatar: "/placeholder.svg?height=128&width=128"
}


type User = {
    name: string
    email: string
    avatar: string
  }


export default function UserDashboardHeader() {
    return (
        // <div className="min-h-screen bg-gray-100">
        //     <header className="bg-white shadow">
        //         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        //             <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        //             <div className="flex items-center">
        //                 <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
        //                 <span className="ml-3 font-medium text-gray-900">{user.name}</span>
        //             </div>
        //         </div>
        //     <header />
        // </div>
        <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <div className="flex items-center">
            <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
            <span className="ml-3 font-medium text-gray-900">{user.name}</span>
          </div>
        </div>
      </header>
    )
}