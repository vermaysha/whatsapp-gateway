import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Message: John Doe | Whatsapp Gateway",
}

export default function Message() {
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
          <h1 className="text-xl font-bold">Message: John Doe</h1>
        </div>
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link href={"/"}>Home</Link>
            </li>
            <li>
              <Link href="/message">Message</Link>
            </li>
            <li>John Doe</li>
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
                  <th className="text-center">Message</th>
                  <th className="text-center">Sent at</th>
                  <th className="text-center">Sent to</th>
                  <th>Status</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover rounded">
                  <th className="w-1">
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <td className="w-4/12 text-justify">
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dolorum deleniti illo sit quia impedit aspernatur omnis
                      officiis necessitatibus. Laborum sapiente adipisci commodi
                      dolore debitis mollitia dolores reprehenderit atque neque
                      deserunt.
                    </p>
                  </td>
                  <td className="text-center">
                    Sunday, 24 February 2022 <br /> 11:00 AM
                  </td>
                  <td className="text-center">
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
                      <div>
                        <div className="font-bold">John doe</div>
                        <div className="text-sm opacity-50">
                          +62 8952 3242 4592
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="tooltip" data-tip="Seen">
                      <span className="badge badge-info badge-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-white"
                          viewBox="0 0 512 512"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="32"
                            d="M464 128L240 384l-96-96m0 96l-96-96m320-160L232 284"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="btn btn-ghost btn-xs">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                          />
                        </svg>
                        Details
                      </button>
                    </div>
                  </td>
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

      <dialog id="my_modal_2" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click outside to close</p>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
