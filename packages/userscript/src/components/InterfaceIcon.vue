<template>
  <el-tooltip content="复制 Interface">
    <svg-icon
      name="ts"
      @click.stop="handleCopyInterface(state.swagger, state.url, interfaceName)"
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
