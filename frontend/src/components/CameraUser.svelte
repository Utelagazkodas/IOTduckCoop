<script lang="ts">
    import { logOut } from "$lib/api/login";
    import { connectingWS } from "$lib/api/stores";
    import { connectWebsocket } from "$lib/api/user";
    import Loading from "./Loading.svelte";

    let globalLogout = false;
</script>


    {#if $connectingWS}
         <Loading/>
    {:else}
         <div class="h-full w-full flex justify-center items-center">
            <button onclick={()=>{
                connectWebsocket()
            }} class="text-xl bg-teal-300 border rounded-xl p-2 hover:cursor-pointer">Connect To Camera</button>
         </div>
    {/if}



<!-- logout button  -->
<div class="absolute bottom-5 left-5">
    <button
        class=" bg-teal-950 rounded-lg p-1 hover:cursor-pointer text-teal-50"
        aria-label="logout"
        onclick={() => {
            logOut(globalLogout);
        }}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            {...$$props}
        >
            <path
                fill="currentColor"
                d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"
            />
        </svg>
    </button>
    <span class="hover:text-black text-transparent transition-all">
        <input type="checkbox" bind:checked={globalLogout} />
        Log out everywhere
    </span>
</div>
