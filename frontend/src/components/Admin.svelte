<script lang="ts">
    import {
        createCam,
        deleteCam,
        editCam,
        getAdminData,
    } from "$lib/api/admin";
    import { logOut } from "$lib/api/login";
    import { adminData } from "$lib/api/stores";
    import type { cameraAdminData } from "@classes";

    getAdminData();

    let openModal: string = ""; // createCam, camToDelete, camToEdit

    let camEmail = "";
    let camAddress = "";

    let errorMsg: string = "";

    let camToDelete: cameraAdminData | undefined = undefined;

    let camToEdit: cameraAdminData | undefined = undefined;

    let globalLogout = false;
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
                        <th>Connection</th>
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
                            <td>
                                <div class="flex justify-center">
                                {#if !camera.connected}
                                     <svg class="text-red-500 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="currentColor" d="M21.4 7.5c.8.8.8 2.1 0 2.8l-2.8 2.8l-7.8-7.8l2.8-2.8c.8-.8 2.1-.8 2.8 0l1.8 1.8l3-3l1.4 1.4l-3 3zm-5.8 5.8l-1.4-1.4l-2.8 2.8l-2.1-2.1l2.8-2.8l-1.4-1.4l-2.8 2.8l-1.5-1.4l-2.8 2.8c-.8.8-.8 2.1 0 2.8l1.8 1.8l-4 4l1.4 1.4l4-4l1.8 1.8c.8.8 2.1.8 2.8 0l2.8-2.8l-1.4-1.4z"/></svg>
                                {:else}
                                     <svg class="text-green-500 bg-black rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="currentColor" d="m9.55 15.15l8.475-8.475q.3-.3.7-.3t.7.3t.3.713t-.3.712l-9.175 9.2q-.3.3-.7.3t-.7-.3L4.55 13q-.3-.3-.288-.712t.313-.713t.713-.3t.712.3z"/></svg>
                                {/if}
                                </div>
                            </td>
                            <td>{camera.publicId}</td>
                            <td>{camera.email}</td>
                            <td>{camera.address}</td>
                            <td
                                ><div class="flex items-center *:mx-0.5">
                                    <div>{camera.token}</div>

                                    <button
                                        aria-label="copy token"
                                        class="hover:cursor-pointer"
                                        onclick={() => {
                                            navigator.clipboard.writeText(
                                                camera.token,
                                            );
                                            alert("Copied token!");
                                        }}
                                        ><svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 36 36"
                                            ><rect
                                                width="36"
                                                height="36"
                                                fill="none"
                                            /><path
                                                fill="currentColor"
                                                d="M22.6 4h-1.05a3.89 3.89 0 0 0-7.31 0h-.84A2.41 2.41 0 0 0 11 6.4V10h14V6.4A2.41 2.41 0 0 0 22.6 4m.4 4H13V6.25a.25.25 0 0 1 .25-.25h2.69l.12-1.11a1.24 1.24 0 0 1 .55-.89a2 2 0 0 1 3.15 1.18l.09.84h2.9a.25.25 0 0 1 .25.25Z"
                                                class="clr-i-outline clr-i-outline-path-1"
                                            /><path
                                                fill="currentColor"
                                                d="M33.25 18.06H21.33l2.84-2.83a1 1 0 1 0-1.42-1.42l-5.25 5.25l5.25 5.25a1 1 0 0 0 .71.29a1 1 0 0 0 .71-1.7l-2.84-2.84h11.92a1 1 0 0 0 0-2"
                                                class="clr-i-outline clr-i-outline-path-2"
                                            /><path
                                                fill="currentColor"
                                                d="M29 16h2V6.68A1.66 1.66 0 0 0 29.35 5h-2.27v2H29Z"
                                                class="clr-i-outline clr-i-outline-path-3"
                                            /><path
                                                fill="currentColor"
                                                d="M29 31H7V7h2V5H6.64A1.66 1.66 0 0 0 5 6.67v24.65A1.66 1.66 0 0 0 6.65 33h22.71A1.66 1.66 0 0 0 31 31.33v-9.27h-2Z"
                                                class="clr-i-outline clr-i-outline-path-4"
                                            /><path
                                                fill="none"
                                                d="M0 0h36v36H0z"
                                            /></svg
                                        ></button
                                    >
                                </div>
                            </td>

                            <td >
                                <div class="flex">
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
                                >
                                <button
                                    aria-label="camToEdit"
                                    class="text-black flex hover:cursor-pointer justify-center w-full"
                                    onclick={() => {
                                        openModal = "camToEdit";
                                        camToEdit = camera;
                                        camAddress = camera.address;
                                        camEmail = camera.email;
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        ><rect
                                            width="24"
                                            height="24"
                                            fill="none"
                                        /><path
                                            fill="currentColor"
                                            d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"
                                        /></svg
                                    ></button
                                >
                                </div>
                            </td>
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
        <span class="hover:text-black text-transparent transition-all">
            <input type="checkbox" bind:checked={globalLogout} />
            Log out everywhere
        </span>
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

    <!-- add camera modal  -->
    {#if openModal == "camToEdit" && camToEdit != undefined}
        <button
            class="absolute bottom-5 right-5 z-10 bg-teal-950 rounded-lg p-1 hover:cursor-pointer text-teal-50"
            aria-label="edit camera"
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
                    placeholder="new email"
                />
                <br />
                <input
                    type="text"
                    bind:value={camAddress}
                    class="bg-teal-900 text-teal-50 py-0.5 px-1.5 rounded"
                    placeholder="new address"
                />
                <br />
                <button
                    class="hover:cursor-pointer bg-teal-900 text-teal-50 px-1.5 py-0.5 rounded mt-1"
                    onclick={async () => {
                        errorMsg = await editCam({
                            email: camEmail,
                            address: camAddress,
                            publicId: camToEdit!.publicId,
                        });

                        if (errorMsg == "") {
                            openModal = "";
                            camEmail = "";
                            camAddress = "";
                        }
                    }}>Edit Camera</button
                >

                {#if errorMsg != ""}
                    <div class="text-red-500">
                        {errorMsg}
                    </div>
                {/if}
            </div>
        </dialog>
    {/if}
</div>
