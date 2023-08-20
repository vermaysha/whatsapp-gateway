<template>
  <div>
    <div
      class="flex justify-between items-center border-b p-4 bg-base-100 rounded"
    >
      <div class="mb-4 flex items-center gap-2">
        <ion-icon name="mail-outline" class="text-2xl"></ion-icon>
        <h1 class="text-xl font-bold">Message: John Doe</h1>
      </div>
      <div class="text-sm breadcrumbs">
        <ul>
          <li>
            <NuxtLink href="/">Home</NuxtLink>
          </li>
          <li>
            <NuxtLink href="/message">Message</NuxtLink>
          </li>
          <li>John Doe</li>
        </ul>
      </div>
    </div>
    <div class="mt-5 bg-base-100 p-4 rounded min-h-screen">
      <div class="p-4 border rounded mb-5">
        <div class="flex justify-between my-4">
          <div class="join">
            <div
              class="join-item items-center flex input-sm place-content-center border"
            >
              <ion-icon name="search-outline" class="text-xl"></ion-icon>
            </div>

            <input
              type="text"
              placeholder="Seach here"
              class="input input-sm w-full max-w-xs join-item input-bordered focus:outline-none"
            />
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
                <th class="text-center">Message</th>
                <th class="text-center">Sent at</th>
                <th class="text-center">Sent to</th>
                <th>Status</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover rounded">
                <th class="w-1">
                  <label>
                    <input type="checkbox" class="checkbox" />
                  </label>
                </th>
                <td class="w-4/12 text-justify">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolorum deleniti illo sit quia impedit aspernatur omnis
                    officiis necessitatibus. Laborum sapiente adipisci commodi
                    dolore debitis mollitia dolores reprehenderit atque neque
                    deserunt.
                  </p>
                </td>
                <td class="text-center">
                  Sunday, 24 February 2022 <br />
                  11:00 AM
                </td>
                <td class="text-center">
                  <div class="flex items-center space-x-3">
                    <div class="avatar">
                      <div class="mask mask-squircle w-10 h-10">
                        <Image
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
                <td>
                  <div class="tooltip" data-tip="Seen">
                    <span class="badge badge-info badge-md">
                      <ion-icon
                        name="checkmark-done-outline"
                        class="text-base p-1 block"
                      ></ion-icon>
                    </span>
                  </div>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <button class="btn btn-ghost btn-xs">
                      <ion-icon
                        name="information-circle-outline"
                        class="text-xl"
                      ></ion-icon>
                      Details
                    </button>
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

    <dialog id="my_modal_2" class="modal">
      <form method="dialog" class="modal-box">
        <h3 class="font-bold text-lg">Hello!</h3>
        <p class="py-4">Press ESC key or click outside to close</p>
      </form>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>
