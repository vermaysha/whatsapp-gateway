import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Device Info | Whatsapp Gateway",
}

interface IDeviceInfo {
  params: {
    uuid: string
  }
}

export default function DeviceInfo({ params }: IDeviceInfo) {
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
          <h1 className="text-xl font-bold">Device Info</h1>
        </div>
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link href={"/"}>Home</Link>
            </li>
            <li>
              <Link href={"/device"}>Device</Link>
            </li>
            <li>Info</li>
          </ul>
        </div>
      </div>
      <div className="mt-5 bg-base-100 p-4 rounded min-h-screen">
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
                <div className="stat-title">Status</div>
                <div className="stat-value">
                  <span className="text-success">Online</span>
                </div>
                {/* <div className="stat-desc">Total connected device</div> */}
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
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="stat-title">Uptime</div>
                <div className="stat-value">24 Hour</div>
                {/* <div className="stat-desc">Total disconnected devices</div> */}
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
                <div className="stat-value">10</div>
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
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>

              <h4 className="text-xl font-semibold">General Information</h4>
            </div>
            <table className="table">
              <tbody>
                <tr className="hover">
                  <th className="w-20">UUID</th>
                  <td className="w-1">:</td>
                  <td>5bca980a-c01f-4cde-b6c7-f6321fc9a5b4</td>
                </tr>
                <tr className="hover">
                  <th className="w-20">Name</th>
                  <td className="w-1">:</td>
                  <td>Device</td>
                </tr>
                <tr className="hover">
                  <th className="w-20">Description</th>
                  <td className="w-1">:</td>
                  <td>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Recusandae adipisci corporis, nobis ipsa in natus at illo
                    aliquid quia sapiente repellendus libero, cum consequatur?
                    Hic iure maxime suscipit et distinctio.
                  </td>
                </tr>
                <tr className="hover">
                  <th className="w-20">Operation System</th>
                  <td className="w-1">:</td>
                  <td>
                    <span className="badge bg-[#E95420] text-white">
                      Ubuntu
                    </span>
                  </td>
                </tr>
                <tr className="hover">
                  <th className="w-20">Browser</th>
                  <td className="w-1">:</td>
                  <td>
                    <span className="badge bg-[#3277BC] text-white">
                      Microsoft Edge
                    </span>
                  </td>
                </tr>
                <tr className="hover">
                  <th className="w-20">Created At</th>
                  <td className="w-1">:</td>
                  <td>Sunday, 24 February 2023</td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="btn btn-sm btn-outline btn-error"
              >
                Delete
              </button>
              <Link
                href={"/device/edit/asjdhasjkdhasjkhdasjk"}
                type="button"
                className="btn btn-sm btn-outline btn-primary"
              >
                Edit
              </Link>
            </div>
          </div>
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
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>

              <h4 className="text-xl font-semibold">
                Connectivity Information
              </h4>
            </div>
            <table className="table">
              <tbody>
                <tr className="hover">
                  <th className="w-28">Started at</th>
                  <td className="w-1">:</td>
                  <td>Sunday, 24 February 2023 at 10:00</td>
                </tr>
                <tr className="hover">
                  <th className="w-28">Last disconnect</th>
                  <td className="w-1">:</td>
                  <td>Sunday, 24 February 2023 at 10:00</td>
                </tr>
                <tr className="hover">
                  <th className="w-28">Uptime</th>
                  <td className="w-1">:</td>
                  <td>24 Hour 1 Minutes 3 Seconds</td>
                </tr>
                <tr className="hover">
                  <th className="w-28">Total reconnect</th>
                  <td className="w-1">:</td>
                  <td>
                    <span className="badge badge-warning">44</span>
                  </td>
                </tr>
                <tr className="hover">
                  <th className="w-28">Action</th>
                  <td className="w-1">:</td>
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
