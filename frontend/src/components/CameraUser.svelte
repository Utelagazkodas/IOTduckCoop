<script lang="ts">
    import { logOut } from "$lib/api/login";
    import { WSData, WSState } from "$lib/api/stores";
    import { connectWebsocket, toggleDoor, toggleLight } from "$lib/api/user";
    import { WSStateData } from "$lib/util/frontendClasses";
    import { doorState, lightState } from "@classes";
    import Loading from "./Loading.svelte";

    let globalLogout = false;

    let canvas: HTMLCanvasElement | null = null;

    $: if (canvas) {
        let ctx = canvas.getContext("bitmaprenderer");
        //ctx!.reset()
        //ctx!.font = "48px serif"
        //ctx!.fillText(`${$WSData}`, 10, 50)
        //let bitmap : ImageBitmap
        if ($WSData != null) {
            ctx!.transferFromImageBitmap($WSData.image);
        }
    }
</script>

{#if $WSState == WSStateData.disconnected}
    <div class="h-full w-full flex justify-center items-center">
        <button
            onclick={() => {
                connectWebsocket();
            }}
            class="text-xl bg-teal-300 border rounded-xl p-2 hover:cursor-pointer"
            >Connect To Camera</button
        >
    </div>
{:else if $WSState == WSStateData.connected && $WSData}
    <div class="h-full w-full flex justify-center items-center">
        <div class="bg-teal-300 border rounded-xl p-2">
            <canvas height="600px" width="800px" bind:this={canvas}></canvas>
            <div
                class="flex justify-evenly items-center *:my-4 *:bg-teal-100 *:h-24 *:aspect-square *:justify-center *:items-center *:flex *:text-center"
            >
                {#if $WSData.doorState}
                    {#if $WSData.doorState == doorState.closed}
                        <button onclick={toggleDoor} class="hover:cursor-pointer">OPEN <br /> DOOR</button>
                    {:else if $WSData.doorState == doorState.open}
                        <button onclick={toggleDoor} class="hover:cursor-pointer">CLOSE <br /> DOOR</button>
                    {:else if $WSData.doorState == doorState.closing}
                        <div>CLOSING <br /> DOOR</div>
                    {:else if $WSData.doorState == doorState.opening}
                        <div>OPENING <br /> DOOR</div>
                    {/if}
                {/if}

                {#if $WSData.lightState}
                    {#if $WSData.lightState == lightState.off}
                        <button onclick={toggleLight} class="hover:cursor-pointer"
                            >TURN <br /> LIGHT <br /> ON</button
                        >
                    {:else if $WSData.lightState == lightState.on}
                        <button onclick={toggleLight} class="hover:cursor-pointer"
                            >TURN <br /> LIGHT <br /> OFF</button
                        >
                    {/if}
                {/if}
            </div>
        </div>
    </div>
{:else}
    <Loading />
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
