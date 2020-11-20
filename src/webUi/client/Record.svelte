<script>
  import ConfirmIcon from './icons/ConfirmIcon.svelte';
  import CloseIcon from './icons/CloseIcon.svelte';
  import DeleteIcon from './icons/DeleteIcon.svelte';
  import IconButton from './IconButton.svelte';
  import Input from './Input.svelte';

  const defaultIconColor = 'cadetblue';
  const dangerIconColor = 'tomato';

  export let mode = 'view';
  export let isSelectable = true;
  export let timestamp;
  export let notes;
  export let onEditClick;
  export let onDeleteClick;
  export let onCancel;
  export let onConfirm;

  let date = new Date(timestamp);
  let timestampForView = `${date.toLocaleDateString('ru')} ${date.toLocaleTimeString('ru')}`;

  const utcOffset = date.getTimezoneOffset() * 60 * 1000;
  let timestampForEdit = new Date(date.getTime() + Math.abs(utcOffset)).toISOString().slice(0, 16);

  let notesForEdit = notes;

  let isDeletePressedOnce = false;

  let previousMode;
  let recordElement = null;

  $: {
    const modeChangedToEdit = previousMode === 'view' && mode === 'edit';
    const modeChangedToView = previousMode === 'edit' && mode === 'view';

    if (modeChangedToEdit) {
      document.addEventListener('click', subscribeToClicksOutside);
    }

    if (modeChangedToView) {
      document.removeEventListener('click', subscribeToClicksOutside);
    }

    previousMode = mode;
  }

  function subscribeToClicksOutside(event) {
    const hasClickedOutside = !recordElement.contains(event.target);

    if (hasClickedOutside) {
      onCancel();
      isDeletePressedOnce = false;
    }
  }

  function onEditClickWithStopPropagation(event) {
    event.stopPropagation();
    onEditClick(event);
  }

  function onDeleteClickGuarded() {
    if (isDeletePressedOnce) {
      onDeleteClick();
    } else {
      isDeletePressedOnce = true;
    }
  }

  function handleConfirm() {
    const minutePrecisionTimestampInitial = getMinutePrecisionTimestamp(timestamp);
    const minutePrecisionTimestampCurrent = new Date(timestampForEdit).getTime();

    const hasTimeChanged = minutePrecisionTimestampCurrent !== minutePrecisionTimestampInitial;
    const hasNotesChanged = notesForEdit !== notes;
    const hasChanged = hasTimeChanged || hasNotesChanged;

    onConfirm(
      {
        originalTimestamp: timestamp,
        updatedTimestamp: hasTimeChanged ? minutePrecisionTimestampCurrent : timestamp,
        notes: notesForEdit,
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
    padding: 0 10px;
    border-radius: 6px;
  }

  .Record:not(:first-of-type) {
    margin-top: 24px;
  }

  .Record > div + div {
    margin: 8px 0 0 0;
  }

  .Record--view {
    color: #b2b2b2;
  }

  .Record--view:hover.isSelectable {
    cursor: pointer;
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
  }

  .Record--view:not(.isSelectable) {
    pointer-events: none;
  }

  .date-container,
  .notes-container,
  .actions-container {
    display: flex;
    align-items: center;
  }

  .actions-container {
    justify-content: space-evenly;
  }

  .notes-container {
    flex: 1;
  }

  .action + .action {
    margin-left: 8px;
  }

  @media (min-width: 768px) {
    .Record {
      display: flex;
      height: 40px;
    }

    .Record:not(:first-of-type) {
      margin-top: 0;
    }

    .Record > div + div {
      margin: 0 0 0 8px;
    }

    .actions-container {
      justify-content: center;
    }
  }
</style>

{#if mode === 'edit'}
  <div class="Record" bind:this={recordElement}>
    <div class="date-container">
      <Input type="datetime-local" bind:value={timestampForEdit} />
    </div>
    <div class="notes-container">
      <Input bind:value={notesForEdit} onChange={handleConfirm} />
    </div>
    <div class="actions-container">
      <div class="action">
        <IconButton onClick={handleConfirm}>
          <ConfirmIcon size={20} fill={defaultIconColor} />
        </IconButton>
      </div>
      <div class="action">
        <IconButton onClick={onCancel}>
          <CloseIcon size={16} fill={defaultIconColor} />
        </IconButton>
      </div>
      <div class="action">
        <IconButton onClick={onDeleteClickGuarded}>
          <DeleteIcon fill={isDeletePressedOnce ? dangerIconColor : defaultIconColor} size={16} />
        </IconButton>
      </div>
    </div>
  </div>
{:else}
  <div class="Record Record--view" class:isSelectable on:click={onEditClickWithStopPropagation}>
    <div class="date-container">{timestampForView}</div>
    <div class="notes-container">{notes}</div>
  </div>
{/if}
