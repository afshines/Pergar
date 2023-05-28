import storage from 'local-storage-fallback'
export default function auth({next, router}) {


    if (!( storage.getItem('Token'))) {
        return router.push({name: 'Login'});
    }

    return next();
}
