<template lang="pug">
.keys(:class="{ horizontal }")
  h3(v-if="!horizontal") Keyboard Shortcuts
  table
    tr
      td.key V
      td Choose Visualizer 
    tr
      td.key C
      td Controls
    tr
      td.key F
      td Full Screen
    tr
      td.key B
      td Beat Interval
</template>

<script>
export default {
  props: {
    horizontal: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.keys {
  margin-bottom: 1rem;
  width: 100%;
}

h3 {
  @include separator;
}

tr {@include flex(center, flex-start, row); }

td {
  font-size: 1rem;
  line-height: 1rem;
  margin-right: 1rem;
}

td + td {
  margin: 0;
  font-family: Quicksand, sans-serif;
  text-transform: none;
}

.horizontal {
  margin-top: 1rem;
  
  table {
    @include flex(center, center, row);
  }

  tr {
    margin: 0 1rem;
  }
  
  td {
    margin: 0 .5rem 0 0;
    font-size: 1.5rem;
  }

  .key {
    @include size(40px);
    @include flex;
    border-radius: 100px;
    font-weight: bold;
    color: black;
    background: white;
  }
}
</style>