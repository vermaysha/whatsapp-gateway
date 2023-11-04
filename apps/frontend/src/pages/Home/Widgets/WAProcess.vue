<template>
  <div class="card card-sm">
    <div class="card-body border-bottom border-success">
      <div class="row align-items-center">
        <div class="col-auto">
          <span class="bg-green text-white avatar">
            <IconPlugConnected />
          </span>
        </div>
        <div class="col">
          <strong>WA Process</strong>
          <div class="text-secondary">Running</div>
        </div>
        <div class="col-auto">
          <div class="dropend">
            <a
              href="#"
              class="btn-action"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <IconDotsVertical />
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <h6 class="dropdown-header">Services Actions</h6>
              </li>
              <li>
                <a href="#" class="dropdown-item text-success">
                  <IconPlayerPlay />
                  <span class="px-2">Start</span>
                </a>
              </li>
              <li>
                <a href="#" class="dropdown-item text-danger">
                  <IconPlayerStop />
                  <span class="px-2">Stop</span>
                </a>
              </li>
              <li>
                <a href="#" class="dropdown-item text-warning">
                  <IconRefresh />
                  <span class="px-2">Restart</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  IconPlugConnected,
  IconDotsVertical,
  IconPlayerStop,
  IconPlayerPlay,
  IconRefresh,
} from "@tabler/icons-vue";
</script>
