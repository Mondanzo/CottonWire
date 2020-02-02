module.exports = [
	{ path: "/", component: () => import("./views/Dashboard.vue") },
	{ path: "/users", component: () => import("./views/Users.vue") },
	{
		path: "/users/:user",
		component: () => import("./views/Users.vue")
	},
	{
		path: "/modpacks",
		component: () => import("./views/Modpacks.vue"),
		children: [
			{
				path: ":modpack",
				component: () => import("./views/Modpack.vue")
			}
		]
	},
	{
		path: "/modpacks/:modpack",
		component: () => import("./views/Modpacks.vue")
	},
	{
		path: "/mods",
		component: () => import("./views/Mods.vue")
	},
	{ path: "/settings", component: () => import("./views/Settings.vue") }
];
