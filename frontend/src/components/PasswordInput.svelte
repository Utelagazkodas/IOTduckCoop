<script>
     let password = ""
     let stayLoggedIn = false;
</script>

<div>
    <input type="text" bind:value={password} />
    <div>
        Stay logged in <input type="checkbox" bind:checked={stayLoggedIn} />
    </div>
</div>
