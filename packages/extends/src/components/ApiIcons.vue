<template>
  <div class="api-icons">
    <el-tooltip content="复制url">
      <svg-icon
        name="url"
        @click="handleCopyPath(path, method)"
        class="url"
      ></svg-icon>
    </el-tooltip>
    <el-tooltip content="复制snippet">
      <svg-icon
        name="snippet"
        @click="handleCopyApi(path, method)"
        class="snippet"
      ></svg-icon>
    </el-tooltip>
    <el-tooltip content="复制模拟数据">
      <span class="mock" @click="handleCopyFake(path, method)"
        >mock</span
      ></el-tooltip
    >
  </div>
</template>

<script>
import { handleCopyPath, handleCopyApi, handleCopyFake } from "@/state";

export default {
  name: "ApiIcons",
  props: {
    path: {
      type: String,
      required: true
    },
    method: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      required: true
    }
  },
  methods: {
    handleCopyPath,
    handleCopyApi,
    handleCopyFake
  }
};
</script>

<style lang="scss" scoped>
.api-icons {
  position: absolute;
  top: 11px;
  right: 55px;
  width: 160px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.svg-icon {
  font-size: 20px;
}
.url {
  font-size: 16px;
}
.mock {
  cursor: pointer;
}
</style>
