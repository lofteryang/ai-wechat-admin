<template>
  <div class="data-card" @mouseover="hover = true" @mouseleave="hover = false">
    <div class="icon-container">
      <i
        :class="'el-icon-' + icon"
        :style="{ backgroundColor: hover ? '#E7F7ED' : '#F8F8F8' }"
      ></i>
    </div>
    <div class="card-content">
      <transition name="flip" mode="out-in">
        <div class="value-container" :key="formattedValue">
          <div class="value" :style="{ color: color }">
            {{ formattedValue }}
          </div>
        </div>
      </transition>
      <div class="title">{{ title }}</div>
    </div>
  </div>
</template>

<style scoped>
.flip-enter-active {
  animation: flip-in 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.flip-leave-active {
  animation: flip-out 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

@keyframes flip-in {
  0% {
    transform: translateY(100%) rotateX(-90deg);
    opacity: 0.5;
  }
  100% {
    transform: translateY(0) rotateX(0);
    opacity: 1;
  }
}

@keyframes flip-out {
  0% {
    transform: translateY(0) rotateX(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100%) rotateX(90deg);
    opacity: 0;
  }
}

.value-container {
  position: relative;
  height: 24px;
  perspective: 100px;
  margin-bottom: 25px;
}

.value {
  font-size: 18px;
  font-weight: bold;
  display: inline-block;
}
</style>

<script>
export default {
  props: {
    icon: String,
    title: String,
    value: Number,
    color: {
      type: String,
      default: '#07C160',
    },
  },
  data() {
    return {
      hover: false,
      shouldJump: false,
    }
  },
  computed: {
    formattedValue() {
      return this.value.toLocaleString()
    },
  },
  watch: {
    value() {
      this.shouldJump = true
      setTimeout(() => {
        this.shouldJump = false
      }, 500)
    },
  },
}
</script>

<style scoped>
.data-card {
  background: white;
  border: 2px solid #e7f7ed;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  height: 80px;
}

.icon-container i {
  font-size: 28px;
  color: #07c160;
  padding: 15px;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.card-content {
  margin-left: 20px;
}

.value {
  font-size: 37px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.title {
  color: #666;
  margin-top: 8px;
}
</style>
