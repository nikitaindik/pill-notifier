<script>
  import Record from './Record.svelte';

  export let updateRecord;
  export let deleteRecord;
  export let records = [];

  let recordBeingEditedTimestamp = null;

  function setRecordBeingEditedTimestamp(timestamp) {
    recordBeingEditedTimestamp = timestamp;
  }
</script>

<div>
  {#each records as record (record.timestamp)}
    <Record
      timestamp={record.timestamp}
      notes={record.notes}
      mode={recordBeingEditedTimestamp === record.timestamp ? 'edit' : 'view'}
      isSelectable={recordBeingEditedTimestamp === null}
      onEditClick={() => {
        setRecordBeingEditedTimestamp(record.timestamp);
      }}
      onDeleteClick={() => {
        setRecordBeingEditedTimestamp(null);
        deleteRecord(record.timestamp);
      }}
      onCancel={() => {
        setRecordBeingEditedTimestamp(null);
      }}
      onConfirm={(record, hasChanged) => {
        setRecordBeingEditedTimestamp(null);

        if (hasChanged) {
          updateRecord(record);
        }
      }} />
  {/each}
</div>
