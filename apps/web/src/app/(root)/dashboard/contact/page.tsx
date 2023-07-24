import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contact | Whatsapp Gateway",
}

export default function Contact() {
  return (
    <>
      <div className="flex justify-between items-center border-b p-4 bg-base-100 rounded">
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
          <h1 className="text-xl font-bold">Contact</h1>
        </div>
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link href={"/dashboard"}>Home</Link>
            </li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="mt-5 bg-base-100 p-4 rounded min-h-screen">
        <div className="p-4 border rounded mb-5">
          <div className="flex justify-between my-4">
            <div className="join">
              <div className="join-item items-center flex input-sm place-content-center border">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>

              <input
                type="text"
                placeholder="Seach here"
                className="input input-sm w-full max-w-xs join-item input-bordered focus:outline-none"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr className="hover">
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <th>Avatar</th>
                  <th>First</th>
                  <th>Last Name</th>
                  <th>Phone number</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover rounded">
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-10 h-10">
                          <Image
                            src="/photo-1534528741775-53994a69daeb.jpg"
                            alt="Profile"
                            width={40}
                            height={40}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>John</td>
                  <td>Doe</td>
                  <td>+62 8953 3425 8990</td>
                  <td>6MhUy@example.com</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between">
            <div></div>
            <div className="join">
              <button className="join-item btn btn-sm">1</button>
              <button className="join-item btn btn-sm">2</button>
              <button className="join-item btn btn-sm btn-disabled">...</button>
              <button className="join-item btn btn-sm">99</button>
              <button className="join-item btn btn-sm">100</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
