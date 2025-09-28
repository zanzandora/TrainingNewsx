<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const footerItems: NavigationMenuItem[] = [
  {
    label: 'Term of use',
    to: 'https://go.nuxt.com/figma-ui',
    target: '_blank',
  },
  {
    label: 'Privacy Policy',
    to: 'https://stackblitz.com/edit/nuxt-ui',
    target: '_blank',
  },
  {
    label: 'Cookie Policy',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank',
  },
]
</script>

<template>
  <div>
    <UFooter class="bg-accented/30 border-accented border-t-2">
      <!-- <template #top>
        <UContainer>
          <UFooterColumns :columns="columns">
            <template #left>
              <h3 className="text-[#141624] font-semibold text-lg mb-4">
                About
              </h3>
              <p className="text-[#696a75] text-sm leading-relaxed mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-[#141624]">
                  <span className="font-medium">Email:</span>
                  info@jstemplate.net
                </p>
                <p className="text-[#141624]">
                  <span className="font-medium">Phone:</span> 880 123 456 789
                </p>
              </div>
            </template>
            <template #right>
              <UFormField
                name="email"
                label="Subscribe to our newsletter"
                size="lg"
              >
                <UInput type="email" class="w-full">
                  <template #trailing>
                    <UButton
                      type="submit"
                      size="xs"
                      color="neutral"
                      label="Subscribe"
                    />
                  </template>
                </UInput>
              </UFormField>
            </template>
          </UFooterColumns>
        </UContainer>
      </template> -->
      <template #left>
        <p class="text-muted text-sm">
          Copyright © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UNavigationMenu :items="footerItems" variant="link" />
      </template>
    </UFooter>
  </div>
</template>
