<template>
  <div>
    <div
      class="flex justify-between items-center border-b p-4 bg-base-100 rounded"
    >
      <div class="mb-4 flex items-center gap-2">
        <ion-icon name="desktop-outline" class="text-2xl"></ion-icon>
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
