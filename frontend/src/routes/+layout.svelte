<script lang="ts">
	import '../app.css';
	
	let { children } = $props();

	import { initApi } from '$lib/api/api';
    import { onMount } from 'svelte';

	onMount(initApi)
</script>

{@render children()}
