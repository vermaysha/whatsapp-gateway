"use client"

import { pageTitle, request, formatPhoneNumber } from "@/lib"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { IDevices } from "./interface"
import Loading from "@/components/Loading"

const fetchData = async () => {
  const res = await request("/devices", { method: "get" })
  const data = await res?.json()

  return data as IDevices
}

export default function Device() {
  const [devices, setDevices] = useState<IDevices | undefined>(undefined)
  useEffect(() => {
    document.title = pageTitle("Device")
  }, [])

  useEffect(() => {
    fetchData()
      .then((res) => {
        setDevices(res)
      })
      .catch(console.error)
  }, [])

  if (!devices) {
    return <Loading />
  }

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
          <h1 className="text-xl font-bold">Device</h1>
        </div>
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link href={"/dashboard"}>Home</Link>
            </li>
            <li>
              <Link href={"/dashboard/device"}>Device</Link>
            </li>
            <li>System</li>
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
            <Link
              href={"/dashboard/device/add"}
              className="btn btn-sm btn-info btn-outline"
            >
              Add{" "}
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </Link>
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
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>&nbsp;</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {devices.data.map((device) => {
                  return (
                    <tr className="hover rounded" key={device.id}>
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
                                src={device.owner.avatar}
                                alt={device.owner.name}
                                width={40}
                                height={40}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{device.name}</div>
                            <div className="text-sm opacity-50">
                              {device.owner.name ||
                                device.owner.notify ||
                                device.owner.verifiedName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{formatPhoneNumber(device.owner.jid)}</td>
                      <td>
                        <span className="badge badge-ghost badge-md">
                          Desktop
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-info badge-md">
                          {device.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/device/info/${device.id}`}
                            className="btn btn-ghost btn-xs"
                          >
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
                            Info
                          </Link>
                          <Link
                            href={`/dashboard/device/system/${device.id}`}
                            className="btn btn-ghost btn-xs"
                          >
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
                                d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                              />
                            </svg>
                            System
                          </Link>
                        </div>
                      </td>
                      <td>
                        <div className="join">
                          <div
                            className="tooltip tooltip-success"
                            data-tip="Start device"
                          >
                            <button className="btn btn-outline btn-sm btn-success join-item">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                                />
                              </svg>
                            </button>
                          </div>
                          <div
                            className="tooltip tooltip-warning"
                            data-tip="Restart device"
                          >
                            <button className="btn btn-outline btn-sm btn-warning join-item">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                                />
                              </svg>
                            </button>
                          </div>
                          <div
                            className="tooltip tooltip-error"
                            data-tip="Stop device"
                          >
                            <button className="btn btn-outline btn-sm btn-error join-item">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
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
