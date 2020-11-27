<script>
  import ConfirmIcon from './icons/ConfirmIcon.svelte';
  import CloseIcon from './icons/CloseIcon.svelte';
  import IconButton from './IconButton.svelte';
  import Input from './Input.svelte';

  export let pillsLeft;
  export let onConfirm;

  $: isValueSet = typeof pillsLeft === 'number';
  $: pillsLeftDisplayValue = isValueSet ? pillsLeft : '-';
  $: pillsLeftInternal = pillsLeft;

  let isEditing = false;

  function onEditClick() {
    isEditing = true;
  }

  function onCancel() {
    isEditing = false;
  }

  function handleConfirm() {
    onConfirm(pillsLeftInternal);
    isEditing = false;
  }

  const defaultIconColor = 'cadetblue';
  const inputStyleOverride = `
    height: 20px;
    font-size: 12px;
    width: 60px;
    padding: 0 8px;
  `;
</script>

<style>
  .PillsLeft {
    height: 24px;
    font-size: 11px;
    color: #b2b2b2;
    display: flex;
    align-items: center;
  }

  .label {
    margin-right: 4px;
  }

  .count {
    cursor: pointer;
  }

  .warning {
    color: goldenrod;
    font-weight: bold;
  }

  .danger {
    color: tomato;
    font-size: 13px;
    font-weight: bold;
  }

  .action {
    margin-left: 4px;
  }
</style>

<div class="PillsLeft">
  <span class="label">Pills left: </span>
  {#if isEditing}
    <Input type="number" bind:value={pillsLeftInternal} style={inputStyleOverride} />
    <div class="action">
      <IconButton size={21} onClick={handleConfirm}>
        <ConfirmIcon size={15} fill={defaultIconColor} />
      </IconButton>
    </div>
    <div class="action">
      <IconButton size={21} onClick={onCancel}>
        <CloseIcon size={11} fill={defaultIconColor} />
      </IconButton>
    </div>
  {:else}
    <span
      class="count"
      class:warning={isValueSet && pillsLeft <= 30}
      class:danger={isValueSet && pillsLeft <= 15}
      on:click={onEditClick}>{pillsLeftDisplayValue}</span>
  {/if}
</div>
