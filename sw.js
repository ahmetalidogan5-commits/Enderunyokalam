const CACHE_NAME="bursa-enderun-yoklama-v1";
const ASSETS=["./","./index.html","./manifest.json","./logo.png"];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache=>cache.addAll(ASSETS))
      .catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch",event=>{
  event.respondWith(
    caches.match(event.request)
      .then(cached=>cached||fetch(event.request))
      .catch(()=>caches.match("./index.html"))
  );
});

self.addEventListener("notificationclick",event=>{
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type:"window"}).then(list=>{
      for(const client of list){
        if(client.url.includes("/index.html")&&"focus" in client) return client.focus();
      }
      if(clients.openWindow) return clients.openWindow("./index.html");
    })
  );
});
