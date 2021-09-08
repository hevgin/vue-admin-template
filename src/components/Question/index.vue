<template>
  <div @click="click">
    <svg-icon icon-class="question" />
  </div>
</template>

<script>

export default {
  name: 'Question',
  data() {
    return {

    }
  },
  methods: {
    click() {
      console.log('question')
    }
  }
}
</script>
