<template>
  <aside class="h-screen">
    <div
      class="border-b z-20 bg-base-100 sticky top-0 hidden items-center px-4 py-2 lg:flex"
    >
      <a href="/" class="flex-0 btn btn-ghost px-2">
        <div class="font-title inline-flex text-lg md:text-2xl">WAGateway</div>
      </a>
    </div>
    <ul class="menu w-80 h-screen bg-base-100 lg:border-r">
      <ul>
        <li class="mb-2">
          <NuxtLink
            to="/"
            :class="{
              active: $route.path === '/',
            }"
            ><ion-icon name="home-outline" class="text-2xl"></ion-icon>
            <span class="capitalize">Dashboard</span></NuxtLink
          >
        </li>
        <li class="mb-2">
          <NuxtLink
            to="/devices"
            :class="{
              active: $route.path.startsWith('/devices'),
            }"
            ><ion-icon name="desktop-outline" class="text-2xl"></ion-icon>
            <span class="capitalize">Devices</span></NuxtLink
          >
        </li>
        <li class="mb-2">
          <NuxtLink
            to="/messages"
            :class="{
              active: $route.path.startsWith('/messages'),
            }"
          >
            <ion-icon name="mail-outline" class="text-2xl"></ion-icon>
            <span class="capitalize">Messages</span></NuxtLink
          >
        </li>
        <li class="mb-2">
          <NuxtLink
            to="/contacts"
            :class="{
              active: $route.path.startsWith('/contacts'),
            }"
            ><span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0"
                />
              </svg>
            </span>
            <span class="capitalize">Contacts</span></NuxtLink
          >
        </li>
      </ul>
      <li class="menu-title">API</li>
      <ul>
        <li class="mb-2">
          <NuxtLink
            to="/api-token"
            :class="{
              active: $route.path.startsWith('/api-token'),
            }"
            ><ion-icon name="key-outline" class="text-2xl"></ion-icon>
            <span class="capitalize">API Token</span></NuxtLink
          >
        </li>
        <li class="mb-2">
          <a href="https://example.com/api-documentation" target="_blank"
            ><ion-icon name="flag-outline" class="text-2xl"></ion-icon>
            <span class="capitalize">API Documentation</span></a
          >
        </li>
      </ul>
    </ul>
  </aside>
</template>
