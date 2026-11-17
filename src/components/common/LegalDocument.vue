<script setup lang="ts">
import { computed } from 'vue'
import { Mail, MapPin } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { SITE } from '@/constants/site'

const props = defineProps<{ docKey: 'privacy-policy' | 'refund-policy' | 'terms-and-conditions' }>()
const { t, tm } = useI18n()

interface LegalSection {
  heading: string
  paragraphs: string[]
}
interface LegalDocumentContent {
  eyebrow: string
  title: string
  intro?: string
  sections: LegalSection[]
}

const doc = computed(
  () => tm(`legal.${props.docKey}`) as unknown as LegalDocumentContent,
)
</script>

<template>
  <main class="pb-24 pt-[68px] md:pt-[104px]">
    <section class="border-b border-border/70 bg-secondary/40 py-16 sm:py-20">
      <div class="container-shell">
        <p class="eyebrow">{{ doc.eyebrow }}</p>
        <h1 class="display-title mt-4 text-h1" v-html="doc.title" />
        <p v-if="doc.intro" class="mt-6 max-w-2xl text-body-md text-muted-foreground">
          {{ doc.intro }}
        </p>
      </div>
    </section>

    <section class="container-shell max-w-4xl pt-14">
      <div class="space-y-10">
        <section
          v-for="section in doc.sections"
          :key="section.heading"
          class="rounded-2xl border border-border/70 bg-card p-6 sm:p-7"
        >
          <h2 class="font-display text-xl font-semibold tracking-[-0.03em]">
            {{ section.heading }}
          </h2>
          <div class="mt-3 space-y-3 text-sm leading-7 text-muted-foreground">
            <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
          </div>
        </section>
      </div>

      <aside class="mt-10 rounded-2xl bg-secondary/45 p-6 text-sm leading-7 text-muted-foreground">
        <p class="font-bold text-foreground">{{ t('legal.aside.questions') }}</p>
        <p class="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
          <a :href="SITE.emailHref" class="inline-flex items-center gap-2 transition hover:text-foreground"><Mail :size="14" /> {{ SITE.email }}</a>
          <a :href="SITE.phones[0].href" class="inline-flex items-center gap-2 transition hover:text-foreground" dir="ltr">{{ SITE.phones[0].display }}</a>
        </p>
        <p class="mt-2 inline-flex items-start gap-2"><MapPin :size="14" class="mt-1 shrink-0" /> {{ SITE.address }}</p>
      </aside>
    </section>
  </main>
</template>
