<template>
  <main id="index" class="frame_center">
    <div class="index_main frame_center_main">
      <el-carousel :interval="2500" type="card" height="300px" trigger="click">
        <el-carousel-item v-for="item in imgObj1" :key="item.id">
          <img :src="item.src" alt />
        </el-carousel-item>
      </el-carousel>
      <div class="aboutUs">
        <div class="aboutUs_main">
          <h1>{{ aboutUs.title }}</h1>
          <p>{{ aboutUs.info }}</p>

          <h1>{{ vision.title }}</h1>
          <p>{{ vision.info }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { reactive } from "@vue/composition-api";
export default {
  name: "index",
  setup() {
    const imgObj = reactive([
      {
        src: require("../images/one.jpg")
      },
      {
        src: require("../images/two.jpg")
      },
      {
        src: require("../images/three.jpg")
      },
      {
        src: require("../images/four.jpg")
      },
      {
        src: require("../images/five.jpg")
      }
    ]);
    // banner
    const imgObj1 = reactive([
      {
        src: require("../images/one1.jpg")
      },
      {
        src: require("../images/two1.jpg")
      },
      {
        src: require("../images/three1.jpg")
      },
      {
        src: require("../images/four1.jpg")
      }
    ]);
    // About US
    const aboutUs = reactive({
      title: `关于我们`,
      info: `
    UTECH CO， LTD，成立于2009年，在中国20多个省份都有合作伙伴，
    并在澳大利亚阿德莱德设有分公司。是一家集研发、生产、销售为一体的专业高科技企业。
    我们的产品包括病人监护仪，脉搏血氧仪，兽医产品，输液泵，治疗设备等。
    此外，我们还可以提供OEM和ODM服务，以满足客户日益增长的需求。
    `,
      src: require("../images/about.jpg")
    });
    // vision
    const vision = reactive({
      title: `愿景`,
      info: `成为创造社会价值的贡献者`
    });
    return {
      imgObj,
      imgObj1,
      aboutUs,
      vision
    };
  }
};
</script>

<style lang="scss" scoped>
$indexHeight: 703px;
.index_main {
  height: $indexHeight;
  .aboutUs {
    .aboutUs_main {
      width: 80%;
      margin: 0 auto;
      padding: 16px 12px 24px;
      h1 {
        color: #335883;
      }
      p {
        font-size: 20px;
        width: 100%;
        padding: 16px 12px 24px;
        line-height: 1.3em;
      }
    }
  }
}

/**banner */
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>