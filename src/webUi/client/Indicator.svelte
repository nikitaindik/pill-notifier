<script>
  export let status = 'off';
</script>

<style>
  .Indicator {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 1);
    transition: box-shadow 200ms ease-in, opacity 200ms ease-in;
    transform: scale(1.5);
  }

  .on {
    box-shadow: inset 0px 0px 8px 6px rgb(255 0 47 / 67%), 0px 0px 25px 9px rgb(255 0 0);
  }

  .off {
    box-shadow: inset 0px 0px 9px 7px rgb(255 0 47), 0px 0px 0px 0px rgb(255 0 0);
    opacity: 0.3;
  }

  .blinking {
    animation: pulse ease-in-out 700ms alternate infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: inset 0px 0px 9px 7px rgb(255 0 47), 0px 0px 25px 5px rgb(255 0 0);
      opacity: 0.3;
    }
    100% {
      box-shadow: inset 0px 0px 8px 6px rgb(255 0 47 / 67%), 0px 0px 25px 9px rgb(255 0 0);
    }
  }
</style>

<div class="Indicator {status}" />
