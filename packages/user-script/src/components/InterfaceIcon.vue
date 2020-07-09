<template>
  <el-tooltip content="复制interface">
    <svg-icon
      name="ts"
      @click="handleCopyInterface(state.swagger, interfaceName)"
    ></svg-icon>
  </el-tooltip>
</template>

<script>
import { handleCopyInterface, state } from "@/state";

export default {
  name: "InterfaceIcon",
  props: {
    interfaceName: {
      type: String,
      required: true
    }
  },
  data: () => ({
    state
  }),
  methods: {
    handleCopyInterface
  }
};
</script>

<style lang="scss" scoped>
.svg-icon {
  font-size: 22px;
  position: absolute;
  right: 20px;
  top: 20px;
}
</style>
