<script>
  export let onClick;
</script>

<style>
  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .PillButton {
    width: 200px;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    margin: 20px;
    height: 55px;
    text-align: center;
    border: none;
    background-size: 300% 100%;

    background-image: linear-gradient(to right, #29323c, #485563, #2b5876, #4e4376);
    box-shadow: 0 4px 15px 0 rgba(45, 54, 65, 0.75);

    border-radius: 50px;
    transition: all 0.4s ease-in-out;

    transform: scale(0.75);
  }

  .PillButton:hover {
    background-position: 100% 0;
    transition: all 0.4s ease-in-out;
  }

  .PillButton:focus {
    outline: none;
  }
</style>

<button class="PillButton" on:click={onClick}><slot /></button>
