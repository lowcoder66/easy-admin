export default (i18n, admin) => [
    {
        icon: "mdi-view-dashboard",
        text: i18n.t("menu.dashboard"),
        link: "/"
    },
    { divider: "text", content: "management" },
    {
        icon: "mdi-family-tree",
        text: i18n.t("menu.org"),
        children: admin.getResourcesNavItems(["authorities", "roles", "employees", "positions"], {name: "org"})
    },
    { divider: "line" },
    {
        icon: "mdi-view-dashboard",
        text: "item a",
        link: "/a"
    },
];
