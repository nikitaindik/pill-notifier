<script>
  export let size = 30;
  export let onClick;
</script>

<style>
  button {
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    font-size: 0;
    cursor: pointer;
  }

  button:hover {
    filter: brightness(1.5);
  }
</style>

<button on:click={onClick} style={`width: ${size}px; height: ${size}px;`}><slot /></button>
