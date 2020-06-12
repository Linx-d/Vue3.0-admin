<template>
  <main id="contacts" class="frame_center">
    <div class="contacts_main frame_center_main">
      <div class="chunk_title">contacts</div>
      <div class="chunk_cnt">
        <el-button :plain="true" @click="open4">错误</el-button>
      </div>
    </div>
  </main>
</template>

<script>
import { getSms } from "@/api/loginApi";
import { onMounted } from "@vue/composition-api";
export default {
  name: "contacts",
  setup(props, { root }) {
    let open4 = () => {
      getSms(1).then(response => {
        root.$message.success(response.msg);
        console.log(response);
      });
    };
    onMounted(() => {
      console.log("????");
    });
    return { open4 };
  }
};
</script>

<style lang="scss" scoped>
</style>