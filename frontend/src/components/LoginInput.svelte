<script>
    import { logIn } from "$lib/api/login";

    let password = "";
    let email = "";
    let stayLoggedIn = false;

    let errorMessage = "";

    let onClick = async () => {
        errorMessage = await logIn(password, email, !stayLoggedIn);
    };
</script>

<div class="w-full h-full flex justify-center items-center">
    <form onsubmit={onClick} class="bg-teal-400 p-3 rounded-xl border-2 border-teal-950">
        <input
            type="text"
            bind:value={email}
            class="bg-teal-900 text-teal-50 py-0.5 px-1.5 rounded mb-1"
            placeholder="email"
        />
        <br />
        <input
            type="password"
            bind:value={password}
            class="bg-teal-900 text-teal-50 py-0.5 px-1.5 rounded"
            placeholder="password"
        />

        <div class="w-full flex mt-1">
            <div>
                Stay logged in <input
                    type="checkbox"
                    bind:checked={stayLoggedIn}
                />
            </div>
            <div class="flex-1 flex items-end"></div>
            <button
                class="hover:cursor-pointer bg-teal-900 text-teal-50 px-1.5 py-0.5 rounded"
                onclick={onClick}>Log In</button
            >
        </div>
        {#if errorMessage != ""}
            <div class="text-red-500">
                {errorMessage}
            </div>
        {/if}
    </form>
</div>
