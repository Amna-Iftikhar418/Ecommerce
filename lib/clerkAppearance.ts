/**
 * Shared Clerk appearance config so every Clerk surface (sign in, sign up,
 * user button popover, account modal) matches the Bella Cucina forest/gold
 * theme instead of Clerk's default purple styling.
 *
 * Every color/font/background/border utility below is prefixed with `!`
 * (Tailwind's important modifier). Clerk injects its own internal styles
 * via a <style> tag added at runtime, after the Next.js stylesheet, so a
 * same-specificity Tailwind utility loses the cascade without `!important`
 * — confirmed by inspecting computed styles on the rendered UserProfile
 * modal (plain utilities were present in the class list but had zero
 * effect). Purely structural utilities (gap, transition) don't need it.
 *
 * `elements.footer*` is hidden everywhere — that's the area Clerk renders
 * the "Secured by Clerk" badge and the development-mode notice. Pages that
 * need a sign in / sign up switch link render their own branded version.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: "var(--accent)",
    colorTextOnPrimaryBackground: "var(--accent-foreground)",
    colorBackground: "var(--card)",
    colorInputBackground: "var(--background)",
    colorInputText: "var(--foreground)",
    colorText: "var(--foreground)",
    colorTextSecondary: "var(--muted-foreground)",
    colorDanger: "var(--destructive)",
    colorSuccess: "#1A7A3C",
    colorNeutral: "var(--foreground)",
    colorShimmer: "var(--accent)",
    borderRadius: "var(--radius)",
    fontFamily: "var(--font-geist-sans)",
    fontFamilyButtons: "var(--font-geist-sans)",
  },
  elements: {
    footer: "!hidden",
    footerAction: "!hidden",
    footerPages: "!hidden",
    footerItem: "!hidden",
    card: "!shadow-sm !rounded-2xl !bg-card !border !border-border",
    headerTitle: "!font-heading !text-foreground",
    headerSubtitle: "!text-muted-foreground",
    dividerLine: "!bg-border",
    dividerText: "!text-muted-foreground",
    formFieldLabel: "!text-foreground !font-medium",
    formFieldInput: "!border-input !bg-background !rounded-xl focus:!border-ring",
    formFieldHintText: "!text-muted-foreground",
    formFieldSuccessText: "!text-[#1A7A3C]",
    formButtonPrimary:
      "!bg-accent !text-accent-foreground !rounded-xl !shadow-none !normal-case hover:!bg-accent/90",
    formButtonReset: "!text-muted-foreground !normal-case hover:!text-foreground",
    formResendCodeLink: "!text-accent hover:!text-accent/80",
    identityPreviewEditButton: "!text-accent hover:!text-accent/80",
    identityPreviewText: "!text-foreground",
    socialButtonsBlockButton: "!border-border !rounded-xl hover:!bg-muted",
    otpCodeFieldInput: "!border-input !rounded-lg",
    badge: "!bg-accent/15 !text-accent-strong !border !border-accent/30 !rounded-full !font-medium",

    /* Modal chrome — openUserProfile()/openUserButtonPopover() render in a portal */
    modalBackdrop: "!backdrop-blur-sm !bg-black/50",
    modalContent: "!rounded-3xl !border !border-border !shadow-2xl !bg-card",
    modalCloseButton: "!text-muted-foreground !rounded-full hover:!text-foreground hover:!bg-muted",

    /* UserProfile shell */
    scrollBox: "!bg-card !rounded-3xl",
    pageScrollBox: "!bg-card",
    page: "!bg-card",
    navbar: "!bg-muted/50 !border-r !border-border rounded-l-3xl",
    navbarButtons: "gap-1",
    navbarButton:
      "!text-muted-foreground !font-medium !rounded-xl transition-colors hover:!bg-card hover:!text-foreground",
    navbarButtonIcon: "!text-current",
    navbarMobileMenuButton: "!text-foreground !rounded-lg hover:!bg-muted",
    navbarMobileMenuRow: "!bg-card !border-b !border-border",

    profileSectionTitleText: "!font-heading !text-foreground",
    profileSectionSubtitleText: "!text-muted-foreground",
    profileSectionContent: "gap-3",
    profileSectionPrimaryButton:
      "!text-accent-strong !font-medium !normal-case hover:!text-accent-strong hover:!bg-accent/10",
    accordionTriggerButton: "!rounded-xl hover:!bg-muted",

    avatarBox: "!ring-2 !ring-accent/30",
    avatarImageActionsUpload: "!text-accent hover:!text-accent/80",

    fileDropAreaBox: "!border-border !bg-muted/40 !rounded-2xl",
    fileDropAreaIcon: "!text-accent",
    fileDropAreaButtonPrimary: "!text-accent !normal-case hover:!text-accent/80",

    menuButton: "!text-muted-foreground !rounded-lg hover:!bg-muted",
    menuList: "!border !border-border !shadow-lg !rounded-xl !bg-card",
    menuItem: "!text-foreground hover:!bg-muted",

    tableHead: "!text-muted-foreground",

    userButtonPopoverCard: "!shadow-lg !rounded-2xl !border !border-border",
    userButtonPopoverActionButton: "hover:!bg-muted",
    userButtonPopoverActionButtonText: "!text-foreground",
    userButtonPopoverFooter: "!hidden",
  },
};
