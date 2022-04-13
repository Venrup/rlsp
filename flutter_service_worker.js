'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "5d8ef06a200ec5dbfc56a36e8cc6fab8",
"index.html": "16f688d3a1c7debea166925545def5d8",
"/": "16f688d3a1c7debea166925545def5d8",
"main.dart.js": "94593a8dbb1c20698f2935f2ad8d4358",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "cd41d501bfa492c25dfb6e54bdcc1c30",
"assets/AssetManifest.json": "1661b45fb929eb06f00506db47020d74",
"assets/NOTICES": "fb901680905477c210567db010d7b54a",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"assets/assets/img_temp/feed_1.jpg": "e74aada309de87ef1ae70eb53ab11824",
"assets/assets/img_temp/feed_0.png": "6e7b2888b903fc324b58df09430f5715",
"assets/assets/img_temp/feed_2.png": "9d63cd2856d2a5e43f6b04240be29139",
"assets/assets/img_temp/crop_5.jpg": "b3c6753ba6443ba7efc4af3422bfe046",
"assets/assets/img_temp/crop_4.jpg": "c6645988624a7e041b6658384ef08c06",
"assets/assets/img_temp/crop_2.jpg": "24c941c4530552b8850f903f7451cddb",
"assets/assets/img_temp/crop_1.jpg": "5dc2264dda61538044ed0a47e9aa24a0",
"assets/assets/img_temp/Photo.png": "2b0cbfda5494c1373e84946f0fecb505",
"assets/assets/img_temp/cat_1.jpg": "4065520e047f75abb0d09a64a5462048",
"assets/assets/img_temp/cat_2.jpg": "5888b72b26f7290e754360717b11122b",
"assets/assets/img_temp/cat_3.jpg": "10fd5267f8ea701b4c5de401909d0d10",
"assets/assets/img_temp/Photo-3.png": "6f917cd3711536c815bba0dea696ed1f",
"assets/assets/img_temp/Photo-2.png": "02546925f9aa629065fb3260c59c9c90",
"assets/assets/img_temp/crop_3.jpeg": "1fecb32acd4ae2515147f45e69e4016c",
"assets/assets/img_temp/Photo-4.png": "4727ba443457125997d0403fcdd07f31",
"assets/assets/icons/add.png": "a302ce45e805fd9e304a68df1e224894",
"assets/assets/icons/place_holder.png": "5b4ad67803e10369c27843ce8b6afe87",
"assets/assets/icons/forum.png": "25cadf6a0b08c7f9e31db8d855e96e92",
"assets/assets/icons/product.png": "904908e5a3901464b357cf5a0c345a15",
"assets/assets/icons/image_loading.gif": "504b535c80c8095184901c10e561233b",
"assets/assets/icons/crop.png": "16ed120eb36d0e907ecf826a07f8db6d",
"assets/assets/icons/home.png": "2f9b14ff7f4c429c0cf58c1df40e4bcc",
"assets/assets/icons/weather.png": "777881ef719c97ad6438e325afb2648e",
"assets/assets/icons/menu.png": "2d2b4154b3cac35d63aa10d99b3a3c2c",
"assets/assets/icons/eye.png": "61f1f892312648bb53ee6f31fdab3900",
"assets/assets/icons/delete.png": "4dde04c26e61c32fe40422e465e45445",
"assets/assets/icons/app_logo.png": "bbf019537698f28ef3553a12c044d459",
"assets/assets/icons/edit.png": "7edf665da241a407f01fd0ac29410b36",
"assets/assets/icons/pic_place_holder.png": "25089e83976c037c19f1b0df065c5ed4",
"assets/assets/icons/eye-slash.png": "e3ef7f59b655ac88c1c96d97a8a95370",
"assets/assets/icons/close.png": "6fb374412a957159df96a8f7057c6896"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
