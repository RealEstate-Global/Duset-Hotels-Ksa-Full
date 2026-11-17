<script setup lang="ts">
import { computed, ref, withDefaults } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import SectionHeading from '@/components/common/SectionHeading.vue'

const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 4 })
const { t, tm } = useI18n()

interface Faq {
  question: string
  answer: string
}

const openIndex = ref(0)
const faqs = computed(() => tm('faq.items') as unknown as Faq[])
const visibleFaqs = computed(() => faqs.value.slice(0, props.limit))
</script>

<template>
  <section class="border-t border-border/70 bg-secondary/45 py-20 sm:py-28">
    <div class="container-shell grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
      <div>
        <SectionHeading
          :eyebrow="t('home.faqPreview.eyebrow')"
          :title="t('home.faqPreview.title')"
          :description="t('home.faqPreview.description')"
        />
        <RouterLink
          v-if="limit < faqs.length"
          to="/faq"
          class="link-underline mt-6 inline-flex text-sm font-bold"
        >
          {{ t('home.faqPreview.viewAll', { count: faqs.length }) }}
        </RouterLink>
      </div>
      <div class="divide-y divide-border border-y border-border">
        <div v-for="(faq, index) in visibleFaqs" :key="faq.question">
          <button
            class="flex w-full items-center justify-between gap-6 py-6 text-left rtl:text-right"
            :aria-expanded="openIndex === index"
            @click="openIndex = openIndex === index ? -1 : index"
          >
            <span class="font-display text-lg font-semibold tracking-[-0.03em]">{{
              faq.question
            }}</span
            ><span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border transition duration-300"
              :class="openIndex === index ? 'rotate-180 bg-primary text-primary-foreground' : ''"
              ><ChevronDown :size="15"
            /></span>
          </button>
          <div
            v-show="openIndex === index"
            class="pb-6 pr-14 text-sm leading-7 text-muted-foreground rtl:pr-0 rtl:pl-14"
          >
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
