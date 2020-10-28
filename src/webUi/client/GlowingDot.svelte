<script>
  export let isActive = false;
</script>

<style>
  .GlowingDot {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: grey;
  }

  .active {
    background: pink;
  }
</style>

<div class={'GlowingDot' + (isActive ? ' active' : '')} />
