<script lang="ts">
  import '@skeletonlabs/skeleton/themes/theme-rocket.css';
  import '@skeletonlabs/skeleton/styles/all.css';
  import "../app.postcss";

  import { AppShell, AppBar, LightSwitch, Modal, Drawer } from '@skeletonlabs/skeleton';
  import { writable, type Writable } from 'svelte/store';
  // const confirmDrawer: Writable<boolean> = writable(false);

  // const openConfirmDrawer: any = () => { confirmDrawer.set(true) };
  // const closeConfirmDrawer: any = () => { confirmDrawer.set(false) };
</script>

<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
  <svelte:fragment slot="header">
    <AppBar>
      <svelte:fragment slot="lead">
        <h1>Libmanager</h1>
      </svelte:fragment>
      <svelte:fragment slot="trail">
        <LightSwitch />
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>
  <svelte:fragment slot="sidebarLeft">
    <nav class="list-nav">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/books">Books</a></li>
        <li><a href="/books">Users</a></li>
      </ul>
    </nav>
  </svelte:fragment>
  <slot />
  <Modal />
  <!-- <Drawer open={openConfirmDrawer} position="right">
    test
    <button on:click={closeConfirmDrawer}>Close</button>
  </Drawer> -->
</AppShell>