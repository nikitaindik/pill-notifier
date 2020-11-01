<script>
  import { onMount } from 'svelte';
  import createConnection from './connection';
  import Indicator from './Indicator.svelte';
  import RecordList from './RecordList.svelte';

  let connection = null;
  let status = 'blinking';
  let records = [];

  function handleMessage({ type, payload }) {
    if (type === 'is_pill_taken_today') {
      status = payload === true ? 'off' : 'on';
      return;
    }

    if (type === 'pill_taken') {
      status = 'off';
      return;
    }

    if (type === 'records') {
      records = JSON.parse(payload);
      return;
    }
  }

  onMount(async () => {
    connection = await createConnection(handleMessage);
  });
</script>

<style>
  :global(body) {
    background: #1d1e22;
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
      'Helvetica Neue', sans-serif;
  }
</style>

<Indicator {status} />
<button on:click={connection.addRecord} disabled={!connection}>Button</button>
<RecordList {records} deleteRecord={connection?.deleteRecord} />
