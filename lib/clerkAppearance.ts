/**
 * Shared Clerk appearance config so every Clerk surface (sign in, sign up,
 * user button popover, account modal) matches the Bella Cucina forest/gold
 * theme instead of Clerk's default purple styling.
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
    colorNeutral: "var(--foreground)",
    borderRadius: "var(--radius)",
    fontFamily: "var(--font-geist-sans)",
    fontFamilyButtons: "var(--font-geist-sans)",
  },
  elements: {
    footer: "!hidden",
    footerAction: "!hidden",
    footerPages: "!hidden",
    card: "shadow-sm border border-border",
    headerTitle: "font-heading",
    headerSubtitle: "text-muted-foreground",
    dividerLine: "bg-border",
    dividerText: "text-muted-foreground",
    formFieldLabel: "text-foreground font-medium",
    formFieldInput: "border-input focus:border-ring",
    formButtonPrimary:
      "bg-accent text-accent-foreground hover:bg-accent/90 normal-case shadow-none",
    formResendCodeLink: "text-accent hover:text-accent/80",
    identityPreviewEditButton: "text-accent hover:text-accent/80",
    socialButtonsBlockButton: "border-border hover:bg-muted",
    userButtonPopoverCard: "shadow-lg border border-border",
    userButtonPopoverActionButton: "hover:bg-muted",
    userButtonPopoverActionButtonText: "text-foreground",
    userButtonPopoverFooter: "!hidden",
  },
};
