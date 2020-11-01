<script>
  import Record from './Record.svelte';

  export let deleteRecord;
  export let records = [];
</script>

<style>
  .record-list {
    width: 500px;
  }
</style>

<div class="record-list">
  {#each records as record (record.timestamp)}
    <Record timestamp={record.timestamp} onDeleteClick={() => deleteRecord(record.timestamp)} />
  {/each}
</div>
