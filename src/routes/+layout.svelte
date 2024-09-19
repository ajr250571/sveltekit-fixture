<script lang="ts">
	import Navbar from '$lib/componentes/Navbar.svelte';
	import '../app.css';
	import { Toaster } from 'svelte-french-toast';
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
	/>
</svelte:head>

<Toaster />
<div class="container mx-auto min-h-screen">
	<Navbar />
	<slot><!-- optional fallback --></slot>
</div>
