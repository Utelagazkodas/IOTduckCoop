<script>
    import { currentSessionToken, foundServer, IP, status } from "$lib/api";
     import { Stretch } from "svelte-loading-spinners";
    import IpInput from "../components/IPInput.svelte";
    import PasswordInput from "../components/PasswordInput.svelte";
    import Main from "../components/Main.svelte";
</script>


<div class="h-screen w-screen bg-teal-800">
     {#if foundServer == undefined}
           <div class="h-screen w-screen flex items-center justify-center">
               <Stretch/>
           </div>
     {:else if  foundServer== false || status== undefined }
           <IpInput/>
     {:else if foundServer === true && status && !currentSessionToken}
           <PasswordInput/>
     {:else}
           <Main/>
     {/if}
</div>
