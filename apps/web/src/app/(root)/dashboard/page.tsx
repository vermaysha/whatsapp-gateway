"use client"

import { pageTitle } from "@/lib"
import Image from "next/image"
import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    document.title = pageTitle("Dashboard")
  })
  return (
    <>
      <div className="flex justify-between items-center border-b p-4 bg-base-100 rounded">
        <h1 className="prose prose-xl font-bold">Dashboard</h1>
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <a>Home</a>
            </li>
            <li>
              <a>Documents</a>
            </li>
            <li>Add Document</li>
          </ul>
        </div>
      </div>
      <div className="mt-5 bg-base-100 p-4 rounded">
        <div className="card w-full p-0">
          <div className="card-body p-0">
            <div className="stats stats-vertical border rounded-md w-full md:stats-horizontal mb-8">
              <div className="stat md:place-items-center">
                <div className="stat-figure text-success">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
                    />
                  </svg>
                </div>
                <div className="stat-title">Connected Device</div>
                <div className="stat-value">1</div>
                <div className="stat-desc">Total connected device</div>
              </div>
              <div className="stat md:place-items-center">
                <div className="stat-figure text-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0"
                    y="0"
                    viewBox="0 0 62 66.25"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <g
                      fill="none"
                      fillRule="evenodd"
                      transform="translate(-9 -14) translate(5 5)"
                    >
                      <path
                        fill="none"
                        d="M42.442 37.511l-3.447-2.894a20.904 20.904 0 0111.39 5.438 1 1 0 11-1.363 1.463 18.937 18.937 0 00-6.58-4.007zm-10.183-.714A18.913 18.913 0 0021.67 43.01a1 1 0 01-1.514-1.306 20.902 20.902 0 0110.2-6.502l1.902 1.596zm-2.532-9.959l-1.913-1.605c9.943-2.592 20.948-.182 28.995 7.322a1 1 0 01-1.364 1.463c-7.15-6.668-16.798-9.037-25.718-7.18zm-6.648 2.253a28.89 28.89 0 00-7.91 5.62 1 1 0 01-1.414-1.413 30.91 30.91 0 017.654-5.608l1.67 1.401zm-3.497-10.768l-1.7-1.426c14.751-6.904 32.797-4.55 45.352 7.159a1 1 0 11-1.364 1.462c-11.702-10.912-28.42-13.282-42.288-7.195zm-5.67 3.075a38.999 38.999 0 00-5.267 4.145 1 1 0 01-1.367-1.46 41.038 41.038 0 015.039-4.025l1.596 1.34zm23.94 31.843a2.5 2.5 0 11-4.096 2.868 2.5 2.5 0 014.096-2.868zm6.587-5.018a1 1 0 01-1.597 1.204 9 9 0 00-12.604-1.772 8.983 8.983 0 00-2.093 2.222 1 1 0 11-1.668-1.103 10.983 10.983 0 012.557-2.716c4.852-3.656 11.75-2.687 15.405 2.165zM4.357 10.766a1 1 0 111.286-1.532L65.44 59.426a1 1 0 11-1.286 1.532L4.357 10.766z"
                      />
                    </g>
                  </svg>
                </div>
                <div className="stat-title">Disconnected Devices</div>
                <div className="stat-value">0</div>
                <div className="stat-desc">Total disconnected devices</div>
              </div>
              <div className="stat md:place-items-center">
                <div className="stat-figure text-info">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
                    />
                  </svg>
                </div>
                <div className="stat-title">Message Sended</div>
                <div className="stat-value">89,400</div>
                <div className="stat-desc">Total message sended</div>
              </div>
              <div className="stat md:place-items-center">
                <div className="stat-figure text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                    />
                  </svg>
                </div>
                <div className="stat-title">Total Contacts</div>
                <div className="stat-value">100</div>
                <div className="stat-desc">Total contacts</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card w-full p-0">
          <div className="card-body p-0">
            <div className="card-title mb-2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 512 512"
              >
                <path d="M326.1 231.9l-47.5 75.5a31 31 0 01-7 7 30.11 30.11 0 01-35-49l75.5-47.5a10.23 10.23 0 0111.7 0 10.06 10.06 0 012.3 14z" />
                <path
                  d="M256 64C132.3 64 32 164.2 32 287.9a223.18 223.18 0 0056.3 148.5c1.1 1.2 2.1 2.4 3.2 3.5a25.19 25.19 0 0037.1-.1 173.13 173.13 0 01254.8 0 25.19 25.19 0 0037.1.1l3.2-3.5A223.18 223.18 0 00480 287.9C480 164.2 379.7 64 256 64z"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="32"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  strokeWidth="32"
                  d="M256 128v32M416 288h-32M128 288H96M165.49 197.49l-22.63-22.63M346.51 197.49l22.63-22.63"
                />
              </svg>
              <h4 className="text-xl font-semibold">System Resource</h4>
            </div>
            <div className="stats stats-vertical border rounded-md w-full md:stats-horizontal">
              <div className="stat md:place-items-center">
                <div className="stat-figure text-success">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0"
                    y="0"
                    viewBox="0 0 55 68.75"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10"
                  >
                    <path d="M51.5 16.582h-48a.5.5 0 00-.5.5v16.5a.5.5 0 00.5.5h1.875v3.836a.5.5 0 00.5.5h43.25a.5.5 0 00.5-.5v-3.836H51.5a.5.5 0 00.5-.5v-16.5a.5.5 0 00-.5-.5zm-2.875 20.836H45.5v-1.261a.5.5 0 10-1 0v1.261h-4.833v-1.261a.5.5 0 10-1 0v1.261h-4.834v-1.261a.5.5 0 10-1 0v1.261H28v-1.261a.5.5 0 10-1 0v1.261h-4.833v-1.261a.5.5 0 10-1 0v1.261h-4.834v-1.261a.5.5 0 10-1 0v1.261H10.5v-1.261a.5.5 0 10-1 0v1.261H6.375v-3.336h42.25v3.336zM51 33.082H4v-15.5h47v15.5z" />
                    <path d="M8.426 31.222h5.26a.5.5 0 00.5-.5V19.941a.5.5 0 00-.5-.5h-5.26a.5.5 0 00-.5.5v10.781a.5.5 0 00.5.5zm.5-10.781h4.26v9.781h-4.26v-9.781zM19.389 31.222h5.26a.5.5 0 00.5-.5V19.941a.5.5 0 00-.5-.5h-5.26a.5.5 0 00-.5.5v10.781a.5.5 0 00.5.5zm.5-10.781h4.26v9.781h-4.26v-9.781zM30.351 31.222h5.26a.5.5 0 00.5-.5V19.941a.5.5 0 00-.5-.5h-5.26a.5.5 0 00-.5.5v10.781a.5.5 0 00.5.5zm.5-10.781h4.26v9.781h-4.26v-9.781zM41.313 31.222h5.26a.5.5 0 00.5-.5V19.941a.5.5 0 00-.5-.5h-5.26a.5.5 0 00-.5.5v10.781a.5.5 0 00.5.5zm.5-10.781h4.26v9.781h-4.26v-9.781z" />
                  </svg>
                </div>
                <div className="stat-title">Memory Usage</div>
                <div className="stat-value">80%</div>
                <div className="stat-desc">Total connected device</div>
              </div>
              <div className="stat md:place-items-center">
                <div className="stat-figure text-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
                    />
                  </svg>
                </div>
                <div className="stat-title">CPU Load</div>
                <div className="stat-value">50%</div>
                <div className="stat-desc">Total disconnected devices</div>
              </div>
              <div className="stat md:place-items-center">
                <div className="stat-figure text-info">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                    />
                  </svg>
                </div>
                <div className="stat-title">Storage</div>
                <div className="stat-value">20%</div>
                <div className="stat-desc">Total message sended</div>
              </div>
              <div className="stat md:place-items-center">
                <div className="stat-figure text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
                    />
                  </svg>
                </div>
                <div className="stat-title">Bandwidth</div>
                <div className="stat-value">100GB</div>
                <div className="stat-desc">Total bandwidth used</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          <div className="col-span-12 border rounded-md px-5 pt-7.5 pb-5 sm:px-7.5 xl:col-span-6 p-4">
            <div className="mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              <h4 className="text-xl font-semibold">Last Sent Message</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <th>Name</th>
                    <th>Message</th>
                    <th>Sent at</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <Image
                              src="/photo-1534528741775-53994a69daeb.jpg"
                              alt="Avatar Tailwind CSS Component"
                              width={56}
                              height={56}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">Hart Hagerty</div>
                          <div className="text-sm opacity-50">
                            United States
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      Zemlak, Daniel and Leannon
                      <br />
                      <span className="badge badge-ghost badge-sm">
                        Desktop Support Technician
                      </span>
                    </td>
                    <td>1 minutes ago</td>
                    <th>
                      <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                  </tr>
                  {/* row 2 */}
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <Image
                              src="/photo-1534528741775-53994a69daeb.jpg"
                              alt="Avatar Tailwind CSS Component"
                              width={56}
                              height={56}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">Brice Swyre</div>
                          <div className="text-sm opacity-50">China</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      Carroll Group
                      <br />
                      <span className="badge badge-ghost badge-sm">
                        Tax Accountant
                      </span>
                    </td>
                    <td>2 minutes ago</td>
                    <th>
                      <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                  </tr>
                  {/* row 3 */}
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <Image
                              src="/photo-1534528741775-53994a69daeb.jpg"
                              alt="Avatar Tailwind CSS Component"
                              width={56}
                              height={56}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">Marjy Ferencz</div>
                          <div className="text-sm opacity-50">Russia</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      Rowe-Schoen
                      <br />
                      <span className="badge badge-ghost badge-sm">
                        Office Assistant I
                      </span>
                    </td>
                    <td>4 minutes ago</td>
                    <th>
                      <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                  </tr>
                  {/* row 4 */}
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <Image
                              src="/photo-1534528741775-53994a69daeb.jpg"
                              alt="Avatar Tailwind CSS Component"
                              width={56}
                              height={56}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">Yancy Tear</div>
                          <div className="text-sm opacity-50">Brazil</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      Wyman-Ledner
                      <br />
                      <span className="badge badge-ghost badge-sm">
                        Community Outreach Specialist
                      </span>
                    </td>
                    <td>10 minutes ago</td>
                    <th>
                      <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                  </tr>
                </tbody>
                {/* foot */}
                <tfoot>
                  <tr>
                    <th>&nbsp;</th>
                    <th>Name</th>
                    <th>Message</th>
                    <th>Sent at</th>
                    <th>&nbsp;</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div className="col-span-12 border rounded-md p-7.5 xl:col-span-6 p-4">
            <div className="mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                />
              </svg>
              <h4 className="text-xl font-semibold">Device</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar online">
                          <div className="mask mask-squircle w-10 h-10">
                            <Image
                              src="/Edge_Logo_2019.svg"
                              alt="Microsft Edge"
                              width={40}
                              height={40}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">Primary Device</div>
                          <div className="text-sm opacity-50">Ubuntu</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-ghost badge-md">
                        Desktop
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-info badge-md">Online</span>
                    </td>
                    <th>
                      <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                  </tr>
                  {/* row 2 */}
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar online">
                          <div className="mask mask-squircle w-10 h-10">
                            <Image
                              src="/Firefox_logo,_2019.svg"
                              alt="Firefox"
                              width={40}
                              height={40}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">Secondary Device</div>
                          <div className="text-sm opacity-50">Windows</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-ghost badge-md">
                        Desktop
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-error badge-md">
                        Offline
                      </span>
                    </td>
                    <th>
                      <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                  </tr>
                  {/* row 3 */}
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar online">
                          <div className="mask mask-squircle w-10 h-10">
                            <Image
                              src="/Google_Chrome_icon_(February_2022).svg"
                              alt="Google Chrome"
                              width={40}
                              height={40}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">Backup Device</div>
                          <div className="text-sm opacity-50">MacOS</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-ghost badge-md">
                        Desktop
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-error badge-md">
                        Offline
                      </span>
                    </td>
                    <th>
                      <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                  </tr>
                </tbody>
                {/* foot */}
                <tfoot>
                  <tr>
                    <th>&nbsp;</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>&nbsp;</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
