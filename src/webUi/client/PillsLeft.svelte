<script>
  export let pillsLeft;

  $: isValueSet = typeof pillsLeft === 'number';
  $: pillsLeftDisplayValue = isValueSet ? pillsLeft : '-';
</script>

<style>
  .PillsLeft {
    font-size: 11px;
    color: #b2b2b2;
  }

  .label {
    vertical-align: middle;
  }

  .count {
    font-weight: bold;
    margin-left: 4px;
    vertical-align: middle;
  }

  .warning {
    color: goldenrod;
  }

  .danger {
    color: tomato;
    font-size: 13px;
  }
</style>

<div class="PillsLeft">
  <span class="label">Pills left: </span><span
    class="count"
    class:warning={isValueSet && pillsLeft <= 30}
    class:danger={isValueSet && pillsLeft <= 15}>{pillsLeftDisplayValue}</span>
</div>
