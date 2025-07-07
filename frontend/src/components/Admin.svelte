<script lang="ts">
    import { createCam, getAdminData } from "$lib/api/admin";
    import { logOut } from "$lib/api/login";
    import { adminData } from "$lib/api/stores";

    getAdminData();

    let openModal: string = ""; // createCam, deleteCam

    let camEmail = "";
    let camAddress = "";
</script>

<div class="w-full h-full flex justify-center items-center relative">
    <div
        class="bg-teal-400 p-3 rounded-xl border-2 border-teal-950 text-center"
    >
        {#if !$adminData}
            No Data
        {:else if $adminData.length == 0}
            No Cameras exist yet
        {:else}
            <table>
                <thead>
                    <tr class="*:px-4">
                        <th>Public ID</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Token</th>
                    </tr>
                </thead>
                <tbody>
                    {#each $adminData as camera}
                        <tr>
                            <td>${camera.publicId}</td>
                            <td>${camera.email}</td>
                            <td>${camera.address}</td>
                            <td>${camera.token}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>

    <!-- logout button  -->
    <button
        class="absolute bottom-5 left-5 bg-teal-950 rounded-lg p-1 hover:cursor-pointer text-teal-50"
        aria-label="logout"
        onclick={() => {
            logOut(false);
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

    <!-- ADD CAMERA STUFF-->
    <!-- add camera button  -->
    <button
        class="absolute bottom-5 right-5 bg-teal-950 rounded-lg p-1 hover:cursor-pointer text-teal-50"
        aria-label="add camera"
        onclick={() => {
            openModal = "createCam";
            let camEmail = "";
            let camAddress = "";
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
                d="M12 21q-.425 0-.712-.288T11 20v-7H4q-.425 0-.712-.288T3 12t.288-.712T4 11h7V4q0-.425.288-.712T12 3t.713.288T13 4v7h7q.425 0 .713.288T21 12t-.288.713T20 13h-7v7q0 .425-.288.713T12 21"
            />
        </svg>
    </button>

    <!-- add camera modal  -->
    {#if openModal == "createCam"}
        <button
            class="absolute bottom-5 right-5 z-10 bg-teal-950 rounded-lg p-1 hover:cursor-pointer text-teal-50"
            aria-label="add camera"
            onclick={() => {
                let camEmail = "";
                let camAddress = "";
                openModal = "";
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
                    d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
                />
            </svg>
        </button>

        <dialog
            class="w-screen h-screen bg-gray-600/80 flex items-center justify-center backdrop-blur-lg"
            open
        >
            <div
                class="bg-teal-400 p-3 rounded-xl border-2 border-teal-950 text-left"
            >
                <input
                    type="text"
                    bind:value={camEmail}
                    class="bg-teal-900 text-teal-50 py-0.5 px-1.5 rounded mb-1"
                    placeholder="email"
                />
                <br />
                <input
                    type="text"
                    bind:value={camAddress}
                    class="bg-teal-900 text-teal-50 py-0.5 px-1.5 rounded"
                    placeholder="password"
                />
                <br>
                            <button
                class="hover:cursor-pointer bg-teal-900 text-teal-50 px-1.5 py-0.5 rounded mt-1"
                onclick={()=>{createCam(camEmail, camAddress)}}>Make Camera</button
            >
            </div>
        </dialog>
    {/if}
</div>
