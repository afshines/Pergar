import storage from 'local-storage-fallback'
export default function noAuth({ next, router }) {
    if (( storage.getItem('Token')) ) {
        return router.push({ name: 'Home' });
    }

    return next();
}
