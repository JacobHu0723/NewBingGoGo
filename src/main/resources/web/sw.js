// 定义版本号和缓存名称
var cacheStorageKey = 'minimal-pwa-1';

// 定义需要缓存的文件列表
var cacheList = [
  '/',
  "./",
];

// 监听 install 事件，在安装 Service Worker 时缓存文件
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheStorageKey)
    .then(cache => cache.addAll(cacheList))
    .then(() => self.skipWaiting())
  );
});

// 监听 activate 事件，在激活 Service Worker 时清除旧缓存
self.addEventListener('activate', function(e) {
  e.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return cacheNames.map(name => {
          if (name !== cacheStorageKey) {
            return caches.delete(name);
          }
        });
      })
    ]).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有匹配的响应，则返回缓存的响应
        if (response) {
          return response;
        }
        // 否则，发起新的网络请求
        return fetch(event.request);
      })
  );
});
