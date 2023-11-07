<template>
  <div class="page">
    <header class="navbar navbar-expand-sm navbar-light d-print-none">
      <div class="container-xl">
        <RouterLink
          :to="{name: 'Home'}"
          class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3"
        >
        WAServer
        </RouterLink>

        <div class="navbar-nav flex-row order-md-last">
          <div class="d-none d-md-flex">
            <a
              href="?theme=light"
              class="nav-link px-0 hide-theme-light"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              aria-label="Enable light mode"
              data-bs-original-title="Enable light mode"
            >
              <IconSun />
            </a>
            <div class="nav-item dropdown d-none d-md-flex me-3">
              <a
                href="#"
                class="nav-link px-0 show"
                data-bs-toggle="dropdown"
                tabindex="-1"
                aria-label="Show notifications"
                aria-expanded="true"
              >
                <IconBell/>
                <span class="badge bg-red"></span>
              </a>
              <div
                class="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card"
                data-bs-popper="static"
              >
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Last updates</h3>
                  </div>
                  <div class="list-group list-group-flush list-group-hoverable">
                    <div class="list-group-item">
                      <div class="row align-items-center">
                        <div class="col-auto">
                          <span
                            class="status-dot status-dot-animated bg-red d-block"
                          ></span>
                        </div>
                        <div class="col text-truncate">
                          <a href="#" class="text-body d-block">Example 1</a>
                          <div
                            class="d-block text-secondary text-truncate mt-n1"
                          >
                            Change deprecated html tags to text decoration
                            classes (#29604)
                          </div>
                        </div>
                        <div class="col-auto">
                          <a href="#" class="list-group-item-actions">
                            <IconStar/>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="list-group-item">
                      <div class="row align-items-center">
                        <div class="col-auto">
                          <span class="status-dot d-block"></span>
                        </div>
                        <div class="col text-truncate">
                          <a href="#" class="text-body d-block">Example 2</a>
                          <div
                            class="d-block text-secondary text-truncate mt-n1"
                          >
                            justify-content:between ⇒
                            justify-content:space-between (#29734)
                          </div>
                        </div>
                        <div class="col-auto">
                          <a href="#" class="list-group-item-actions show">
                            <IconStar/>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="list-group-item">
                      <div class="row align-items-center">
                        <div class="col-auto">
                          <span class="status-dot d-block"></span>
                        </div>
                        <div class="col text-truncate">
                          <a href="#" class="text-body d-block">Example 3</a>
                          <div
                            class="d-block text-secondary text-truncate mt-n1"
                          >
                            Update change-version.js (#29736)
                          </div>
                        </div>
                        <div class="col-auto">
                          <a href="#" class="list-group-item-actions">
                            <IconStar/>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="list-group-item">
                      <div class="row align-items-center">
                        <div class="col-auto">
                          <span
                            class="status-dot status-dot-animated bg-green d-block"
                          ></span>
                        </div>
                        <div class="col text-truncate">
                          <a href="#" class="text-body d-block">Example 4</a>
                          <div
                            class="d-block text-secondary text-truncate mt-n1"
                          >
                            Regenerate package-lock.json (#29730)
                          </div>
                        </div>
                        <div class="col-auto">
                          <a href="#" class="list-group-item-actions">
                            <IconStar/>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="nav-item dropdown">
            <a
              href="#"
              class="nav-link d-flex lh-1 text-reset p-0"
              data-bs-toggle="dropdown"
              aria-label="Open user menu"
              aria-expanded="false"
            >
              <span
                class="avatar avatar-sm"
                style="background-image: url(./000m.jpg)"
              ></span>
              <div class="d-none d-xl-block ps-2">
                <div>Paweł Kuna</div>
                <div class="mt-1 small text-secondary">UI Designer</div>
              </div>
            </a>
            <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <a href="#" class="dropdown-item">Status</a>
              <a href="./profile.html" class="dropdown-item">Profile</a>
              <a href="#" class="dropdown-item">Feedback</a>
              <div class="dropdown-divider"></div>
              <a href="./settings.html" class="dropdown-item">Settings</a>
              <a href="./sign-in.html" class="dropdown-item">Logout</a>
            </div>
          </div>
        </div>
      </div>
    </header>
    <header class="navbar-expand-md">
      <div class="collapse navbar-collapse" id="navbar-menu">
        <div class="navbar">
          <div class="container-xl">
            <div class="row flex-fill align-items-center">
              <div class="col">
                <ul class="navbar-nav">
                  <li class="nav-item">
                    <RouterLink
                      :to="{
                        name: 'Home',
                      }"
                      class="nav-link"
                    >
                      <span class="nav-link-icon d-md-none d-lg-inline-block">
                        <IconHome />
                      </span>
                      <span class="nav-link-title">Home</span>
                    </RouterLink>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="page-wrapper">
      <RouterView />
      <footer class="footer footer-transparent d-print-none">
        <div class="container-xl">
          <div
            class="row text-center align-items-center flex-row-reverse justify-content-center"
          >
            <div class="col-12 col-lg-auto mt-3 mt-lg-0">
              <ul class="list-inline list-inline-dots mb-0">
                <li class="list-inline-item">
                  Copyright © 2023
                  <a href="." class="link-secondary">Tabler</a>. All rights
                  reserved.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconHome, IconSun, IconBell, IconStar } from "@tabler/icons-vue";
</script>
