import React, { useEffect, useState } from 'react';
import { mockData } from './mockData';

const Table = () => {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [users, setUsers] = useState([]);
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [startIdx, setStartIdx] = useState(0);

    useEffect(() => {
        getDataFromGithub();
    },[]);

    useEffect(() => {
        generatePageUsers(users);
    },[currPage]);

    const generatePageUsers = (users) => {
        const startIdx = (currPage-1)*10;
        const endIdx = startIdx+10;
        const actualUsers = users.slice(startIdx,endIdx);
        setDisplayedUsers(actualUsers);
        setStartIdx(startIdx);
    }

    useEffect(() => {
        getDataFromGithub(text);
    },[text])

    const getDataFromGithub = async (username) => {
        try {
            // const data = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(username)}&sort=followers`, { method: "get", headers: { Authorization: 'Bearer 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'}});
            // const response = await data.json();
            // console.log(response);
            // const users = response.items;
        
            // Fetch full name for each user
            // const userDetails = await Promise.all(
            //     users.map(async user => {
            //         const userDetailsResponse = await fetch(user.url);
            //         const jsonResp = await userDetailsResponse.json();
            //         return jsonResp;
            //     })
            // );

            // // console.log(userDetails[0]);
      
            // Extract desired user information (e.g., username, full name, avatar URL, profile URL)
            const newData = username ? mockData.filter(ud => ud.name.toLowerCase().includes(username?.toLowerCase()) || ud.login.toLowerCase().includes(username?.toLowerCase())) : mockData;
            const formattedUsers = newData.map(user => ({
                fullName: user.name,
                username: user.login,
                avatarUrl: user.avatar_url,
                followers: user.followers,
                following: user.following,
                publicRepos: user.public_repos,
                reposUrl: user.repos_url,
                twitterUsername: user.twitter_username,
                url: user.html_url
            }));

            setUsers(formattedUsers);
            setCurrPage(1);
            setTotalPages(Math.ceil(formattedUsers.length/10));
            generatePageUsers(formattedUsers);
        } catch (error) {
          console.error('Error searching users:', error);
          setError(error.message);
        }
    }

    const handleOnChange = (e) => {
        e.preventDefault();
        if(e.target.value)
            setText(e.target.value);
        else
            setText("");
    }

    const openNewWindow = (url) => {
        window.open(url, "_blank");
    }

    const getPages = () => {
        if (totalPages <= 5) {
            return [1, 2, 3, 4, 5].filter(p => p <= totalPages);
        }

        const pages = [currPage];
        if (currPage + 4 <= totalPages) {
            if (currPage+ 1 <= totalPages) pages.push(currPage+ 1);
            if (currPage+ 2 <= totalPages) pages.push(currPage+ 2);
            if (currPage+ 3 <= totalPages) pages.push(currPage+ 3);
            if (currPage+ 4 <= totalPages) pages.push(currPage+ 4);

            return pages;
        } else {
            return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }
    }

    const handlePageClick = (page) => {
        setCurrPage(page);
    }

    return (
        <div className="tw-relative tw-overflow-x-auto tw-shadow-md sm:tw-rounded-lg">
            <div className="tw-my-4 tw-mx-4 tw-flex tw-items-center tw-justify-center">
                <label htmlFor="table-search" className="tw-sr-only">Search</label>
                <div className="tw-relative">
                    <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3 tw-pointer-events-none">
                        <svg className="tw-w-5 tw-h-5 tw-text-gray-500 dark:tw-text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input onChange={handleOnChange} type="text" id="table-search-users" className="tw-block tw-p-2 tw-pl-10 tw-text-sm tw-text-gray-900 tw-border tw-border-gray-300 tw-rounded-lg tw-w-80 tw-bg-gray-50 focus:tw-ring-blue-500 focus:tw-border-blue-500 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-placeholder-gray-400 dark:tw-text-white dark:focus:tw-ring-blue-500 dark:focus:tw-border-blue-500" placeholder="Search for users" />
                </div>
            </div>
            <table className="tw-w-full tw-text-sm tw-text-left tw-text-gray-500 dark:tw-text-gray-400">
                <thead className="tw-text-xs tw-text-gray-700 tw-uppercase tw-bg-gray-50 dark:tw-bg-[#050c2a] dark:tw-text-gray-200">
                    <tr>
                        <th scope="col" className="tw-px-6 tw-py-3">
                            Name
                        </th>
                        <th scope="col" className="tw-px-6 tw-py-3">
                            Followers
                        </th>
                        <th scope="col" className="tw-px-6 tw-py-3">
                            Following
                        </th>
                        <th scope="col" className="tw-px-6 tw-py-3">
                            Repos
                        </th>
                        <th scope="col" className="tw-px-6 tw-py-3">
                            Twitter
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {displayedUsers.length && displayedUsers.map((user, idx) => (
                        <tr style={{ background: idx%2 == 0 ? "#060a3c" : "#04072c" }} className="tw-border-b dark:tw-border-gray-700 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-600">
                            <th scope="row" className="tw-flex tw-items-center tw-px-6 tw-py-1 tw-text-gray-900 tw-whitespace-nowrap dark:tw-text-white">
                                <img onClick={() => openNewWindow(user.url)} className="tw-cursor-pointer tw-w-10 tw-h-10 tw-rounded-full" src={user.avatarUrl || "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-File.png"} alt="Jese image" />
                                <div onClick={() => openNewWindow(user.url)} className="tw-pl-3 tw-cursor-pointer">
                                    <div className="tw-text-base tw-font-semibold">{user.fullName}</div>
                                    <div className="tw-font-normal tw-text-gray-500">{user.username}</div>
                                </div>
                            </th>
                            <td className="tw-px-6 tw-py-4">
                                {user.followers}
                            </td>
                            <td className="tw-px-6 tw-py-4">
                                {user.following}
                            </td>
                            <td className="tw-px-6 tw-py-4">
                                <a target="_blank" href={user.reposUrl} className="tw-font-medium tw-text-blue-600 dark:tw-text-blue-500 hover:tw-underline">{user.publicRepos}</a>
                            </td>
                            <td className="tw-px-6 tw-py-4">
                                {user.twitterUsername ?
                                    <a target="_blank" href={`https://twitter.com/${user.twitterUsername}`} className="tw-font-medium tw-text-blue-600 dark:tw-text-blue-500 hover:tw-underline">{user.twitterUsername}</a>
                                    : <span className="tw-font-medium tw-text-slate-300 dark:tw-text-slate-300">{"-"}</span> }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <nav className="tw-bg-black tw-flex tw-items-start tw-justify-between tw-p-4" aria-label="Table navigation">
                <span className="tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                    Showing &nbsp;&nbsp;
                <span className="tw-font-semibold tw-text-gray-900 dark:tw-text-white">{startIdx+1}-{startIdx+displayedUsers.length}</span>&nbsp;&nbsp;
                of&nbsp;&nbsp;
                <span className="tw-font-semibold tw-text-gray-900 dark:tw-text-white">{users.length}</span>
                </span>
                <ul className="tw-inline-flex tw-items-stretch tw--space-x-px tw-cursor-pointer">
                    <li>
                        <button disabled={currPage == 1} onClick={() => handlePageClick(currPage-1)} className="tw-flex tw-items-center tw-justify-center tw-h-full tw-py-1.5 tw-px-3 tw-ml-0 tw-text-gray-500 tw-bg-white tw-rounded-l-lg tw-border tw-border-gray-300 hover:tw-bg-gray-100 hover:tw-text-gray-700 dark:tw-bg-gray-800 dark:tw-border-gray-700 dark:tw-text-gray-400 dark:hover:tw-bg-gray-700 dark:hover:tw-text-white">
                            <span className="tw-sr-only">Previous</span>
                            <svg className="tw-w-5 tw-h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </li>
                    {getPages().map(page => (
                        <li key={page} onClick={() => handlePageClick(page)}>
                            <span className={`tw-flex tw-items-center tw-justify-center tw-px-3 tw-py-2 tw-text-sm tw-leading-tight tw-text-gray-500 tw-bg-white tw-border tw-border-gray-300 hover:tw-bg-gray-100 hover:tw-text-gray-700 ${page == currPage ? "dark:tw-bg-black" : "dark:tw-bg-gray-800"} dark:tw-border-gray-700 dark:tw-text-gray-400 dark:hover:tw-bg-gray-700 dark:hover:tw-text-white`}>{page}</span>
                        </li>
                    ))}
                    <li>
                        <button disabled={currPage == totalPages} onClick={() => handlePageClick(currPage+1)} className="tw-flex tw-items-center tw-justify-center tw-h-full tw-py-1.5 tw-px-3 tw-leading-tight tw-text-gray-500 tw-bg-white tw-rounded-r-lg tw-border tw-border-gray-300 hover:tw-bg-gray-100 hover:tw-text-gray-700 dark:tw-bg-gray-800 dark:tw-border-gray-700 dark:tw-text-gray-400 dark:hover:tw-bg-gray-700 dark:hover:tw-text-white">
                            <span className="tw-sr-only">Next</span>
                            <svg className="tw-w-5 tw-h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Table;
