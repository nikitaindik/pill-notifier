<script>
  import ConfirmIcon from './icons/ConfirmIcon.svelte';
  import CloseIcon from './icons/CloseIcon.svelte';
  import DeleteIcon from './icons/DeleteIcon.svelte';
  import IconButton from './IconButton.svelte';
  import Input from './Input.svelte';

  export let mode = 'view';
  export let timestamp;
  export let notes;
  export let onEditClick;
  export let onDeleteClick;
  export let onCancelClick;
  export let onConfirm;

  let date = new Date(timestamp);
  let formattedTimestamp = `${date.toLocaleDateString('ru')} ${date.toLocaleTimeString('ru')}`;

  const utcOffset = date.getTimezoneOffset() * 60 * 1000;
  let inputTimestamp = new Date(date.getTime() + Math.abs(utcOffset)).toISOString().slice(0, 16);

  let inputNotes = notes;

  function handleConfirm() {
    const minutePrecisionTimestampInitial = getMinutePrecisionTimestamp(timestamp);
    const minutePrecisionTimestampCurrent = new Date(inputTimestamp).getTime();

    const hasTimeChanged = minutePrecisionTimestampCurrent !== minutePrecisionTimestampInitial;
    const hasNotesChanged = inputNotes !== notes;
    const hasChanged = hasTimeChanged || hasNotesChanged;

    onConfirm(
      {
        originalTimestamp: timestamp,
        updatedTimestamp: hasTimeChanged ? minutePrecisionTimestampCurrent : timestamp,
        notes: inputNotes,
      },
      hasChanged
    );
  }

  function getMinutePrecisionTimestamp(timestamp) {
    const date = new Date(timestamp);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date.getTime();
  }
</script>

<style>
  .Record {
    display: flex;
    height: 40px;
    padding: 0 10px;
  }

  .Record--view {
    cursor: pointer;
  }

  .Record--view:hover {
    color: powderblue;
  }

  .Record > div + div {
    margin-left: 8px;
  }

  .date-container,
  .notes-container,
  .actions-container {
    display: flex;
    align-items: center;
  }

  .notes-container {
    flex: 1;
  }

  .actions-container {
    display: flex;
  }

  .action + .action {
    margin-left: 8px;
  }
</style>

{#if mode === 'edit'}
  <div class="Record">
    <div class="date-container">
      <Input type="datetime-local" bind:value={inputTimestamp} />
    </div>
    <div class="notes-container">
      <Input bind:value={inputNotes} />
    </div>
    <div class="actions-container">
      <div class="action">
        <IconButton onClick={handleConfirm}>
          <ConfirmIcon size={20} />
        </IconButton>
      </div>
      <div class="action">
        <IconButton onClick={onCancelClick}>
          <CloseIcon size={16} />
        </IconButton>
      </div>
      <div class="action">
        <IconButton onClick={onDeleteClick}>
          <DeleteIcon size={16} />
        </IconButton>
      </div>
    </div>
  </div>
{:else}
  <div class="Record Record--view" on:click={onEditClick}>
    <div class="date-container">{formattedTimestamp}</div>
    <div class="notes-container">{notes}</div>
  </div>
{/if}
