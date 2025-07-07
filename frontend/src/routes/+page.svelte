<script>
    import { currentSessionToken, IP, serverNotFound, status } from "$lib/api/stores";


  import Admin from "../components/Admin.svelte";
  import CameraUser from "../components/CameraUser.svelte";
  import Loading from "../components/Loading.svelte";
  import LoginInput from "../components/LoginInput.svelte";
  import ServerNotFound from "../components/ServerNotFound.svelte";

</script>

<div class="h-screen w-screen bg-teal-800">
  {#if !$currentSessionToken && !$status
   && $IP && $serverNotFound}
    <ServerNotFound />
  {:else if !$currentSessionToken && $status && $IP && !$serverNotFound}
    <LoginInput />
  {:else if $currentSessionToken && !$currentSessionToken.admin && $status && $IP && !$serverNotFound}
    <CameraUser />
  {:else if $currentSessionToken && $currentSessionToken.admin && $status && $IP && !$serverNotFound}
    <Admin />
  {:else}
    <Loading />
  {/if}
</div>
