<script lang="ts">
    import '@skeletonlabs/skeleton/themes/theme-rocket.css';
    import '@skeletonlabs/skeleton/styles/all.css';
    import "../app.postcss";

    import LoginForm from '../components/LoginForm.svelte';
    import { store } from "../hooks/auth"

    function logOut() {
      $store = "";
    }

    import { AppShell, AppBar, LightSwitch, Modal, menu } from '@skeletonlabs/skeleton';

    import Fa from 'svelte-fa';
    import { faUser, faHouse, faBook, faUsers, faGears } from '@fortawesome/free-solid-svg-icons';

    import { Settings, theme } from '$lib/stores';
    let title = Settings.title;

    // theme.subscribe(setTheme);
    // function setTheme() {
    //   // if (!browser) return;
    //   document.body.setAttribute('data-theme', $theme)
    // }
</script>

{#if $store != ""}
  <AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
    <svelte:fragment slot="header">
      <AppBar>
        <svelte:fragment slot="lead">
          <h1>{title}</h1>
        </svelte:fragment>
        <svelte:fragment slot="trail">
          <LightSwitch />
          <span class="relative">
          <button class="btn-icon items-right" use:menu={{ menu: 'userMenu' }}> <Fa icon={faUser} /> </button>
          <nav class="list-nav card p-4 w-40 shadow-xl" data-menu="userMenu">
            <ul>
              <li><a href={''} on:click={logOut}>Logout</a></li>
            </ul>
          </nav>
          </span>
        </svelte:fragment>
      </AppBar>
    </svelte:fragment>
    <svelte:fragment slot="sidebarLeft">
      <nav class="list-nav">
        <ul>
          <li><a href="/"><Fa icon={faHouse} /> Home</a></li>
          <li><a href="/books"><Fa icon={faBook} /> Books</a></li>
          <li><a href="/users"><Fa icon={faUsers} /> Users</a></li>
          <!-- <li><a href="/settings"><Fa icon={faGears} />Settings</a></li> -->
        </ul>
      </nav>
    </svelte:fragment>
		<!-- <Transition url={$page.url}>
			<slot />
		</Transition> -->
    <slot />
    <Modal />
    <!-- <Drawer open={openConfirmDrawer} position="right">
      test
      <button on:click={closeConfirmDrawer}>Close</button>
    </Drawer> -->
  </AppShell>
{:else}
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
  <LoginForm />
  <Modal />
</AppShell>
{/if}