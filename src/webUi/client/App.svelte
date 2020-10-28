<script>
  import GlowingDot from './GlowingDot.svelte';

  let isActive = false;

  function handleClick() {
    console.log(isActive, '->', !isActive);
    isActive = !isActive;
  }
</script>

<button on:click={handleClick}>Button</button>
<GlowingDot {isActive} />
