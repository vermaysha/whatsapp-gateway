<template>
  <div>
    <div
      class="flex justify-between items-center border-b p-4 bg-base-100 rounded"
    >
      <div class="mb-4 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          class="w-6 h-6 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
          />
        </svg>
        <h1 class="text-xl font-bold">Edit Device</h1>
      </div>
      <div class="text-sm breadcrumbs">
        <ul>
          <li>
            <NuxtLink href="/">Home</NuxtLink>
          </li>
          <li>
            <NuxtLink href="/devices">Device</NuxtLink>
          </li>
          <li>Edit</li>
        </ul>
      </div>
    </div>
    <div class="mt-5 bg-base-100 p-4 rounded min-h-screen">
      <form action="POST">
        <div class="mb-5">
          <label class="mb-2.5 block text-primary">
            Name <span class="text-error">*</span>
          </label>
          <input
            type="title"
            placeholder="Device name"
            class="input w-full input-bordered focus:outline-none focus:border-primary active:border-primary"
          />
        </div>
        <div class="mb-5 flex flex-col gap-6 xl:flex-row">
          <div class="w-full xl:w-1/2">
            <label class="mb-2.5 block text-primary">
              OS <span class="text-error">*</span>
            </label>
            <select
              class="select select-bordered w-full focus:outline-none focus:border-primary active:border-primary"
            >
              <option disabled selected>Select your prefered OS</option>
              <option>Windows</option>
              <option>Ubuntu</option>
              <option>MacOS</option>
            </select>
          </div>
          <div class="w-full xl:w-1/2">
            <label class="mb-2.5 block text-primary">
              Browser <span class="text-error">*</span>
            </label>
            <select
              class="select select-bordered w-full focus:outline-none focus:border-primary active:border-primary"
            >
              <option disabled selected>Select your prefered browser</option>
              <option>Microsoft Edge</option>
              <option>Google Chrome</option>
              <option value="Firefox">Firefox</option>
            </select>
          </div>
        </div>
        <div class="flex justify-between mt-4">
          <button type="reset" class="btn btn-sm btn-outline btn-error">
            Reset
          </button>
          <button type="button" class="btn btn-sm btn-outline btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
