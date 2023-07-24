import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Device System | Whatsapp Gateway",
}

interface IDeviceSystem {
  params: {
    uuid: string
  }
}

export default function DeviceSystem({ params }: IDeviceSystem) {
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
          <h1 className="text-xl font-bold">Device System</h1>
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
      </div>
    </>
  )
}
