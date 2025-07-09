<script lang="ts">
    import { createCam, deleteCam, getAdminData } from "$lib/api/admin";
    import { logOut } from "$lib/api/login";
    import { adminData } from "$lib/api/stores";
    import type { cameraAdminData } from "$lib/util/classes";

    getAdminData();

    let openModal: string = ""; // createCam, camToDelete

    let camEmail = "";
    let camAddress = "";

    let errorMsg: string = "";

    let camToDelete: cameraAdminData | undefined = undefined;

    let globalLogout = false
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
                    <tr class="*:px-4 *:border-x">
                        <th>Public ID</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Token</th>
                        <th>
                            <button
                                aria-label="refresh admin data"
                                class="text-teal-950 hover:cursor-pointer"
                                onclick={getAdminData}
                                ><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    ><path
                                        fill="currentColor"
                                        d="M12 20q-3.35 0-5.675-2.325T4 12t2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V5q0-.425.288-.712T19 4t.713.288T20 5v5q0 .425-.288.713T19 11h-5q-.425 0-.712-.288T13 10t.288-.712T14 9h3.2q-.8-1.4-2.187-2.2T12 6Q9.5 6 7.75 7.75T6 12t1.75 4.25T12 18q1.7 0 3.113-.862t2.187-2.313q.2-.35.563-.487t.737-.013q.4.125.575.525t-.025.75q-1.025 2-2.925 3.2T12 20"
                                    /></svg
                                ></button
                            ></th
                        >
                    </tr>
                </thead>
                <tbody>
                    {#each $adminData as camera}
                        <tr
                            class="*:px-1 *:py-0.5 *:border-x *:border-t text-sm"
                        >
                            <td>{camera.publicId}</td>
                            <td>{camera.email}</td>
                            <td>{camera.address}</td>
                            <td>{camera.token}</td>
                            <td>
                                <button
                                    aria-label="camToDelete"
                                    class="text-red-500 flex hover:cursor-pointer justify-center w-full"
                                    onclick={() => {
                                        openModal = "camToDelete";
                                        camToDelete = camera;
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        ><path
                                            fill="currentColor"
                                            d="m9.4 16.5l2.6-2.6l2.6 2.6l1.4-1.4l-2.6-2.6L16 9.9l-1.4-1.4l-2.6 2.6l-2.6-2.6L8 9.9l2.6 2.6L8 15.1zM7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM7 6v13z"
                                        /></svg
                                    ></button
                                ></td
                            >
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>

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
        <input
                    type="checkbox"
                    bind:checked={globalLogout}
                />
    </div>

    <!-- ADD CAMERA STUFF-->
    <!-- add camera button  -->
    <button
        class="absolute bottom-5 right-5 bg-teal-950 rounded-lg p-1 hover:cursor-pointer text-teal-50"
        aria-label="add camera"
        onclick={() => {
            openModal = "createCam";
            camEmail = "";
            camAddress = "";
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
                camEmail = "";
                camAddress = "";
                openModal = "";
                errorMsg = "";
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
                    placeholder="address"
                />
                <br />
                <button
                    class="hover:cursor-pointer bg-teal-900 text-teal-50 px-1.5 py-0.5 rounded mt-1"
                    onclick={async () => {
                        errorMsg = await createCam({
                            email: camEmail,
                            address: camAddress,
                        });

                        if (errorMsg == "") {
                            openModal = "";
                            camEmail = "";
                            camAddress = "";
                        }
                    }}>Make Camera</button
                >

                {#if errorMsg != ""}
                    <div class="text-red-500">
                        {errorMsg}
                    </div>
                {/if}
            </div>
        </dialog>
    {/if}

    <!-- delete camera modal  -->
    {#if openModal == "camToDelete" && camToDelete != undefined}
        <button
            class="absolute top-5 right-5 z-10 bg-teal-950 rounded-lg p-1 hover:cursor-pointer text-teal-50"
            aria-label="add camera"
            onclick={() => {
                camEmail = "";
                camAddress = "";
                errorMsg = "";
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
                Are you sure you want to delete this cam?
                <hr />

                Address: {camToDelete.address}
                <br />
                Email: {camToDelete.email}

                {#if errorMsg != ""}
                    <div class="text-red-500">
                        {errorMsg}
                    </div>
                {/if}
                <div
                    class="flex justify-evenly mt-1 *:px-2.5 *:py-1 *:rounded *:border-2 *:hover:cursor-pointer"
                >
                    <button
                        class="bg-red-500"
                        onclick={() => {
                            openModal = "";
                            deleteCam({
                                email: camToDelete!.email,
                                publicId: camToDelete!.publicId,
                            });
                            camToDelete = undefined;
                        }}
                    >
                        DELETE
                    </button>
                    <button
                        class="bg-green-500"
                        onclick={() => {
                            camToDelete = undefined;
                            openModal = "";
                            getAdminData();
                        }}
                    >
                        Go back
                    </button>
                </div>
            </div>
        </dialog>
    {/if}
</div>
