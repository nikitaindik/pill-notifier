<script>
  export let value;
  export let type = 'text';
  export let onChange;
</script>

<style>
  input {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    border: none;
    padding: 0 15px;
    height: 34px;
    font-size: 13px;
    color: #fff;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    position: relative;
  }

  ::-webkit-calendar-picker-indicator {
    filter: invert(1);
    outline: none;
    cursor: pointer;
    right: 6px;
    position: absolute;
  }
</style>

<input
  {type}
  {value}
  on:change={(event) => {
    value = event.target.value;
    onChange(event);
  }} />
