<script>
  export let onClick;
</script>

<style>
  button {
    width: 30px;
    height: 30px;
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    font-size: 0;
    cursor: pointer;
  }
</style>

<button on:click={onClick}><slot /></button>
