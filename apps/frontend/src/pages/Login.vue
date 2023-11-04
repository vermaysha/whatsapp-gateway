<template>
  <div class="vh-100 d-flex flex-column bg-white">
    <div class="row g-0 flex-fill">
      <div
        class="col-12 col-lg-6 col-xl-4 border-top-wide border-primary d-flex flex-column justify-content-center"
      >
        <div class="container container-tight my-5 px-lg-5">
          <div class="text-center mb-4">
            <a href="." class="navbar-brand navbar-brand-autodark"
              ><img src="/logo.svg" height="36" alt="Logo"
            /></a>
          </div>
          <h2 class="h3 text-center mb-3">Login to your account</h2>
          <form action="" method="get" autocomplete="off" novalidate  @submit.prevent.stop="login">
            <div class="mb-3">
              <label class="form-label">Email address</label>
              <input
                type="email"
                class="form-control"
                placeholder="your@email.com"
                autocomplete="off"
              />
            </div>
            <div class="mb-2">
              <label class="form-label">
                Password
                <!-- <span class="form-label-description">
                  <a href="./forgot-password.html">I forgot password</a>
                </span> -->
              </label>
              <div class="input-group input-group-flat">
                <input
                  type="password"
                  class="form-control"
                  placeholder="Your password"
                  autocomplete="off"
                />
                <span class="input-group-text">
                  <a
                    href="javascript:void(0);"
                    class="link-secondary"
                    title="Show password"
                    data-bs-toggle="tooltip"
                    ><!-- Download SVG icon from http://tabler-icons.io/i/eye -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                      <path
                        d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"
                      />
                    </svg>
                  </a>
                </span>
              </div>
            </div>
            <!-- <div class="mb-2">
              <label class="form-check">
                <input type="checkbox" class="form-check-input" />
                <span class="form-check-label">Remember me on this device</span>
              </label>
            </div> -->
            <div class="form-footer">
              <button type="submit" class="btn btn-primary w-100">
                Sign in
              </button>
            </div>
          </form>
          <!-- <div class="text-center text-secondary mt-3">
            Don't have account yet?
            <a href="./sign-up.html" tabindex="-1">Sign up</a>
          </div> -->
        </div>
      </div>
      <div class="col-12 col-lg-6 col-xl-8 d-none d-lg-block">
        <!-- Photo -->
        <div
          class="bg-cover h-100 min-vh-100"
          style="
            background-image: url(./login-bg.jpg);
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter();

function login() {
  router.push({
    name: 'Home'
  })
}
</script>
