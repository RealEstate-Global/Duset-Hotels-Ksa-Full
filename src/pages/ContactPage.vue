<script setup lang="ts">
import { Clock3, Mail, MapPin, MessageCircle, Phone, ArrowUpRight, ExternalLink } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { SITE } from '@/constants/site'

const { t } = useI18n()
</script>

<template>
  <main class="pb-24 pt-[68px] md:pt-[104px]">
    <section class="border-b border-border/70 bg-secondary/40 py-16 sm:py-20">
      <div class="container-shell flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div>
          <p class="eyebrow">{{ t('contact.eyebrow') }}</p>
          <h1 class="display-title mt-4 text-h1" v-html="t('contact.title')" />
        </div>
        <p class="max-w-sm text-body-md text-muted-foreground">
          {{ t('contact.subline') }}
        </p>
      </div>
    </section>

    <section class="container-shell grid gap-10 pt-14 lg:grid-cols-[1fr_1.1fr]">
      <div class="space-y-4">
        <div class="rounded-2xl border border-border/70 bg-card p-6">
          <div class="flex items-start gap-4">
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent"><MapPin :size="20" /></span>
            <div>
              <h2 class="font-display text-lg font-semibold tracking-[-0.03em]">{{ t('contact.location') }}</h2>
              <p class="mt-2 text-sm leading-6 text-muted-foreground">{{ SITE.address }}</p>
              <a
                :href="SITE.mapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="link-underline mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-accent"
                >{{ t('common.actions.openInGoogleMaps') }} <ExternalLink :size="12"
              /></a>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-border/70 bg-card p-6">
          <div class="flex items-start gap-4">
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent"><Phone :size="20" /></span>
            <div>
              <h2 class="font-display text-lg font-semibold tracking-[-0.03em]">{{ t('contact.phone') }}</h2>
              <div class="mt-2 space-y-1.5">
                <a
                  v-for="phone in SITE.phones"
                  :key="phone.href"
                  :href="phone.href"
                  class="block text-sm font-semibold text-foreground/85 transition hover:text-accent"
                  dir="ltr"
                  >{{ phone.display }}</a
                >
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-border/70 bg-card p-6">
          <div class="flex items-start gap-4">
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent"><Mail :size="20" /></span>
            <div>
              <h2 class="font-display text-lg font-semibold tracking-[-0.03em]">{{ t('contact.email') }}</h2>
              <a
                :href="SITE.emailHref"
                class="mt-2 block text-sm font-semibold text-foreground/85 transition hover:text-accent"
                >{{ SITE.email }}</a
              >
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-border/70 bg-card p-6">
          <div class="flex items-start gap-4">
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent"><Clock3 :size="20" /></span>
            <div>
              <h2 class="font-display text-lg font-semibold tracking-[-0.03em]">{{ t('contact.frontDeskHours') }}</h2>
              <p class="mt-2 text-sm leading-6 text-muted-foreground">
                {{ t('contact.hoursBody') }}<br />{{ t('contact.checkInOut') }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <a
            :href="SITE.callbackUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-5 py-4 text-sm font-bold text-accent transition hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground"
          >
            {{ t('common.actions.requestCallback') }} <ArrowUpRight :size="15" class="icon-flip" />
          </a>
          <a
            :href="SITE.whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-4 text-sm font-bold text-foreground transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
          >
            <MessageCircle :size="16" /> {{ t('contact.whatsappChat') }}
          </a>
        </div>
      </div>

      <div class="min-h-[420px] overflow-hidden rounded-2xl border border-border/70">
        <iframe
          :src="SITE.mapsEmbedUrl"
          :title="t('contact.mapTitle')"
          class="h-full min-h-[420px] w-full border-0"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  </main>
</template>
