export default [
  {
    name: "authorities",
    icon: "mdi-shield-alert",
    api: "/org/authorities",
  },
  {
    name: "roles",
    icon: "mdi-account-box-multiple",
    api: "/org/roles",
  },
  {
    name: "departments",
    api: "/org/departments",
    actions: [
      "create",
      "delete",
      {
        name: "update",
        refreshItem: false,
      },
    ],
  },
  {
    name: "employees",
    icon: "mdi-account-group",
    api: "/org/employees",
  },
  {
    name: "positions",
    icon: "mdi-clipboard-account",
    api: "/org/positions",
  },
  {
    name: "dispatches",
    icon: "mdi-gift",
    actions: ["add", "list=simple", "list"],
  },
  {
    name: "accounts",
    icon: "mdi-key",
    api: "/uac/management/accounts",
  },
  {
    name: "clients",
    icon: "mdi-certificate",
    api: "/uac/management/clients",
  },
]
