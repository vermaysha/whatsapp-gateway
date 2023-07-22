import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Add Device | Whatsapp Gateway",
}

export default function AddDevice() {
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
          <h1 className="text-xl font-bold">Add Device</h1>
        </div>
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link href={"/"}>Home</Link>
            </li>
            <li>
              <Link href={"/device"}>Device</Link>
            </li>
            <li>Add</li>
          </ul>
        </div>
      </div>
      <div className="mt-5 bg-base-100 p-4 rounded min-h-screen">
        <form action={"POST"}>
          <div className="mb-5">
            <label className="mb-2.5 block text-primary">
              Name <span className="text-error">*</span>
            </label>
            <input
              type="title"
              placeholder="Device name"
              className="input w-full input-bordered focus:outline-none focus:border-primary active:border-primary"
            />
          </div>
          <div className="mb-5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-primary">
                OS <span className="text-error">*</span>
              </label>
              <select className="select select-bordered w-full focus:outline-none focus:border-primary active:border-primary">
                <option disabled selected>
                  Select your prefered OS
                </option>
                <option>Windows</option>
                <option>Ubuntu</option>
                <option>MacOS</option>
              </select>
            </div>
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-primary">
                Browser <span className="text-error">*</span>
              </label>
              <select className="select select-bordered w-full focus:outline-none focus:border-primary active:border-primary">
                <option disabled selected>
                  Select your prefered browser
                </option>
                <option>Microsoft Edge</option>
                <option>Google Chrome</option>
                <option value="Firefox">Firefox</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button type="reset" className="btn btn-sm btn-outline btn-error">
              Reset
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline btn-primary"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
