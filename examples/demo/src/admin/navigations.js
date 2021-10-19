export default (i18n, admin) => [
  {
    icon: "mdi-view-dashboard",
    text: i18n.t("menu.dashboard"),
    link: "/",
  },
  { divider: "text", content: "admin" },
  {
    icon: "mdi-family-tree",
    text: i18n.t("menu.org"),
    children: admin.getResourcesNavItems(["authorities", "roles", "employees", "positions"], { name: "org" }),
  },
  {
    icon: "mdi-lock",
    text: i18n.t("menu.auth"),
    children: admin.getResourcesNavItems(["accounts", "clients"], { name: "auth" }),
  },
  { divider: "line" },
  {
    icon: "mdi-view-dashboard",
    text: "item a",
    link: "/a",
  },
]
