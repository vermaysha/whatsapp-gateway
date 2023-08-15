<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col bg-base-100">
      <Navbar />
      <div class="m-10 min-h-[calc(100vh-197px)]"><slot /></div>
      <footer class="footer footer-center p-4 bg-neutral text-neutral-content">
        <div class="">
          <p>
            Copyright © {{ new Date().getFullYear() }} - All right reserved by
            Ashary Vermaysha.
          </p>
        </div>
      </footer>
    </div>
    <div class="drawer-side w-screen">
      <label for="my-drawer-3" class="drawer-overlay" />
      <Sidebar />
    </div>
  </div>
</template>
