<script>
  export let timestamp;
  export let onDeleteClick;

  let date = new Date(timestamp);
  let formattedTimestamp = `${date.toLocaleDateString('ru')} ${date.toLocaleTimeString('ru')}`;
</script>

<style>
  .record {
    display: flex;
  }

  .record > div {
    flex: 1;
  }
</style>

<div class="record">
  <div>{formattedTimestamp}</div>
  <button on:click={onDeleteClick}>Delete</button>
</div>
