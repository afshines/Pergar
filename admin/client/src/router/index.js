import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NewsView from '../views/NewsView.vue'
import RssView from '../views/RssView.vue'
import FeedView from '../views/FeedView.vue'
import MediaView from '../views/MediaView.vue'
import LoginView from '../views/LoginView.vue'
import auth from '../middleware/auth';
import noAuth from "../middleware/noAuth";
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      middleware: [auth],
    },
  },

  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      middleware: [noAuth],
    }
  },

  {
    path: '/news',
    name: 'News',
    component: NewsView,
    meta: {
      middleware: [auth],
    }
  },

  {
    path: '/media',
    name: 'Media',
    component: MediaView,
    meta: {
      middleware: [auth],
    }
  },

  {
    path: '/feed',
    name: 'Feed',
    component: FeedView,
    meta: {
      middleware: [auth],
    }
  },

  {
    path: '/rss',
    name: 'Rss',
    component: RssView,
    meta: {
      middleware: [auth],
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.
function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index];
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next;

  return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters);
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index
        )
    ;
    subsequentMiddleware({...context, next: nextMiddleware});
  };
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
        ? to.meta.middleware
        : [to.meta.middleware];

    const context = {
      from,
      next,
      router,
      to,
    };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({...context, next: nextMiddleware});
  }

  return next();
});


export default router
