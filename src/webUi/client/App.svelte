<script>
  import { onMount } from 'svelte';
  import createConnection from './connection';

  import Container from './Container.svelte';
  import Indicator from './Indicator.svelte';
  import PillButton from './PillButton.svelte';
  import PillsLeft from './PillsLeft.svelte';
  import RecordList from './RecordList.svelte';

  let connection = null;
  let status = 'blinking';
  let pillsLeft = null;
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
      const payloadClone = [...payload];
      records = payloadClone.reverse().map((record) => ({
        ...record,
        notes: record.notes || '',
      }));
      return;
    }

    if (type === 'pills_left') {
      pillsLeft = payload.acyclovir;
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

  .header-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 32px;
  }

  .record-list-wrapper {
    margin-top: 32px;
  }

  .pill-button-wrapper {
    margin-top: 16px;
  }
</style>

<Container>
  <div class="header-wrapper">
    <Indicator {status} />
    <div class="pill-button-wrapper">
      <PillButton onClick={connection?.addRecord} disabled={!connection}>TAKE A PILL</PillButton>
    </div>
    <PillsLeft onConfirm={connection?.updatePillsLeft} {pillsLeft} />
  </div>
  <div class="record-list-wrapper">
    <RecordList {records} updateRecord={connection?.updateRecord} deleteRecord={connection?.deleteRecord} />
  </div>
</Container>
