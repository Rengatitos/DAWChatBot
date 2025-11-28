// src/router/routes.js
const routes = [
	{
		path: '/',
		component: () => import('src/layouts/MainLayout.vue'),
		children: [
			{ path: '', redirect: '/chat' },
			{ path: 'chat', component: () => import('src/pages/ChatBotPage.vue'), name: 'chat' },
			{ path: 'actividades', component: () => import('src/pages/ActividadesPage.vue'), name: 'actividades' },
			{ path: 'recursos', component: () => import('src/pages/RecursosPage.vue'), name: 'recursos' },
			{ path: 'perfil', component: () => import('src/pages/PerfilPage.vue'), name: 'perfil' },
			{ path: 'admin', component: () => import('src/pages/AdminHomePage.vue'), name: 'admin' }
		]
	},

	// 404
	{ path: '/:catchAll(.*)*', component: () => import('src/pages/ErrorNotFound.vue') }
]

export default routes
