<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div class="min-h-screen bg-zinc-800">
    <Navbar />
    <div class="  ">
      <RouterView></RouterView>
    </div>
    <Info />
  </div>
</template>
