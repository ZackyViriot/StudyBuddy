// this is going to be the search bar for the card 
import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";


interface SearchBarStudyGroupProps {
    onSearch: (studyGroup: any[]) => void
}


const SearchBarForSearchStudyGroup: React.FC<SearchBarStudyGroupProps> = ({ onSearch }) => {

    const [searchBarData, setSearchBarData] = useState<string>("")
    const location = useLocation();

    useEffect(() => {
        const storedSearchBarData = localStorage.getItem('searchBarValue');
        if (storedSearchBarData) {
            setSearchBarData("")
            localStorage.removeItem('searchBarValue')
        }
    }, [location.pathname])

    const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const searchData = e.target.value;
        setSearchBarData(searchData)

        try {
            const response = await axios.get(`http://localhost:8000/studyGroup/search`, {
                params: { title: searchData }
            })
            onSearch(response.data);
            localStorage.setItem("searchBarValue", searchData);
        } catch (err) {
            console.error("Error with fetching search results", err)
        }
    }
    return (

        <div className="flex justify-center ">
            <form className="relative flex w-96   max-md:justify-center max-md:items-center z-30 items-center text-center lg:max-w-1xl  max-w-lg mt-3">
                <div className="absolute inset-y-0 left-3 flex items-center  pointer-events-none">
                    <svg
                        className="w-4 h-4 text-black"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"

                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                    </svg>
                </div>
                <input
                    type="search"
                    id="default-search"
                    className="block w-full p-4 pl-10 text-sm text-black border border-gray-300 rounded-lg bg-gray-50 focus:border-black focus:ring-black focus:ring-1 focus:outline-none"
                    placeholder="Search for studyGroup"
                    required
                    value={searchBarData}
                    onChange={handleInputChange}
                    style={{ paddingRight: '3rem' }} // Adjust padding to accommodate button
                />
                <button
                    type="submit"
                    className="absolute right-2.5 bottom-2.5 bg-black text-white hover:bg-spring-green-900 focus:ring-4 focus:outline-none focus:ring-spring-green-900 font-medium rounded-lg text-sm px-4 py-2"
                >
                    Search
                </button>
            </form>
        </div>
    )
}

export default SearchBarForSearchStudyGroup