export default (i18n, admin) => [
    {
        icon: "mdi-view-dashboard",
        text: i18n.t("menu.dashboard"),
        link: "/"
    },
    { divider: "text", content: "admin" },
    {
        icon: "mdi-family-tree",
        text: "Demo",
    },
    { divider: "line" },
];
