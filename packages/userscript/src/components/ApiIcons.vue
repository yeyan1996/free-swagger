<template>
  <div class="api-icons">
    <el-tooltip content="复制代码块">
      <svg-icon
        name="snippet"
        @click.stop="handleCopyApi(path, method)"
        class="snippet"
      ></svg-icon>
    </el-tooltip>
    <el-tooltip content="复制 url">
      <svg-icon
        name="url"
        @click.stop="handleCopyPath(path, method)"
        class="url"
      ></svg-icon>
    </el-tooltip>
    <el-tooltip content="写入磁盘">
      <svg-icon
        name="disk"
        @click.stop="handleWriteToDisk(path, method)"
        class="url"
      ></svg-icon>
    </el-tooltip>
    <el-tooltip content="复制模拟数据">
      <span class="mock" @click.stop="handleCopyFake(path, method)"
        >mock</span
      ></el-tooltip
    >
  </div>
</template>

<script>
import {
  handleCopyPath,
  handleCopyApi,
  handleCopyFake,
  handleWriteToDisk,
} from "@/state";

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
    },
  },
  methods: {
    handleCopyPath,
    handleCopyApi,
    handleCopyFake,
    handleWriteToDisk
  }
};
</script>

<style scoped>
.api-icons {
  position: absolute;
  top: 11px;
  right: 85px;
  width: 160px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.svg-icon {
  font-size: 20px;
  margin-right: 25px;
}
.url {
  font-size: 16px;
}
.mock {
  cursor: pointer;
}
</style>
