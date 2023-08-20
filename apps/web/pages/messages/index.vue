<template>
  <div>
    <div
      class="flex justify-between items-center border-b p-4 bg-base-100 rounded"
    >
      <div class="mb-4 flex items-center gap-2">
        <ion-icon name="mail-outline" class="text-2xl"></ion-icon>
        <h1 class="text-xl font-bold">Message</h1>
      </div>
      <div class="text-sm breadcrumbs">
        <ul>
          <li>
            <NuxtLink href="/">Home</NuxtLink>
          </li>
          <li>Message</li>
        </ul>
      </div>
    </div>
    <div class="mt-5 bg-base-100 p-4 rounded min-h-screen">
      <div class="p-4 border rounded mb-5">
        <div class="flex justify-between items-center my-4">
          <div class="w-full max-w-xs z-50">
            <!-- <Select
              options="{options}"
              defaultValue="{options[0]}"
              placeholder="Select your devices"
            /> -->
          </div>
          <div class="join">
            <input
              type="text"
              placeholder="Seach here"
              class="input input-sm w-full max-w-xs join-item input-bordered focus:outline-none"
            />
            <div
              class="join-item items-center flex input-sm place-content-center border"
            >
              <ion-icon name="search-outline" class="text-xl"></ion-icon>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr class="hover">
                <th>
                  <label>
                    <input type="checkbox" class="checkbox" />
                  </label>
                </th>
                <th>Name</th>
                <th>Last message</th>
                <th>Total message</th>
                <th>Status</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover rounded">
                <th>
                  <label>
                    <input type="checkbox" class="checkbox" />
                  </label>
                </th>
                <td>
                  <div class="flex items-center space-x-3">
                    <div class="avatar online">
                      <div class="mask mask-squircle w-10 h-10">
                        <img
                          src="/photo-1534528741775-53994a69daeb.jpg"
                          alt="Profile"
                          width="40"
                          height="40"
                        />
                      </div>
                    </div>
                    <div>
                      <div class="font-bold">John doe</div>
                      <div class="text-sm opacity-50">+62 8952 3242 4592</div>
                    </div>
                  </div>
                </td>
                <td>Lorem ipsum dolor sit amet consectetur</td>
                <td>
                  <span class="badge badge-ghost badge-md">40</span>
                </td>
                <td>
                  <span class="badge badge-info badge-md">Online</span>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <NuxtLink
                      href="/message/info?uuid=123456789"
                      class="btn btn-ghost btn-xs"
                    >
                      <ion-icon
                        name="information-circle-outline"
                        class="text-xl"
                      ></ion-icon>
                      Details
                    </NuxtLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 flex justify-between">
          <div></div>
          <div class="join">
            <button class="join-item btn btn-sm">1</button>
            <button class="join-item btn btn-sm">2</button>
            <button class="join-item btn btn-sm btn-disabled">...</button>
            <button class="join-item btn btn-sm">99</button>
            <button class="join-item btn btn-sm">100</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
